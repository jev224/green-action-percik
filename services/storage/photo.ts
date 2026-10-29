import { supabase } from "@/lib/supabase";
import { debounce } from "@/utils";
import { readPhotoBytes } from "@/utils/photoTools";
import { ServerError } from "../ServerError";

const SIGNED_URL_EXPIRATION = 60 * 60; // 1 hour
const EXPIRY_BUFFER_MS = 60 * 1000; // refresh 1 min earlys
const BATCH_DELAY_MS = 80;
const IMAGE_CONTENT_TYPE = "image/jpeg";

interface PendingRequest {
	resolve: (url: string) => void;
	reject: (e: unknown) => void;
}

export interface PhotoTransformOption {
	width: number;
	height: number;
	quality: number;
}

export class PhotoStorage {
	private readonly _urlCache = new Map<
		string,
		{ url: string; expiresAt: number }
	>();
	private readonly _pending = new Map<string, PendingRequest>();
	private readonly _inflight = new Map<string, Promise<string>>();
	private readonly _flush = debounce(
		() => this._flushPending(),
		BATCH_DELAY_MS,
	);

	constructor(private readonly bucket: string) {}

	async upload(path: string, localUri: string, upsert = true) {
		try {
			const arrayBuffer = await readPhotoBytes(localUri);

			const { error, data } = await supabase.storage
				.from(this.bucket)
				.upload(path, arrayBuffer, { contentType: IMAGE_CONTENT_TYPE, upsert });

			if (error) throw error;
			if (!data) throw new Error("Upload succeeded but no data was returned");

			return data;
		} catch (e) {
			throw this._parseError(
				"upload photo",
				"Foto belum bisa diupload. Coba lagi ya",
				e,
			);
		}
	}

	async replace(path: string, localUri: string) {
		try {
			const arrayBuffer = await readPhotoBytes(localUri);

			const { error, data } = await supabase.storage
				.from(this.bucket)
				.update(path, arrayBuffer, { contentType: IMAGE_CONTENT_TYPE });

			if (error) throw error;
			if (!data) throw new Error("Replace succeeded but no data was returned");

			return data.id;
		} catch (e) {
			throw this._parseError(
				"replace photo",
				"Foto belum bisa diganti. Coba lagi ya",
				e,
			);
		}
	}

	async remove(path: string | string[]) {
		try {
			const pathArray = Array.isArray(path) ? path : [path];

			const { error } = await supabase.storage
				.from(this.bucket)
				.remove(pathArray);

			if (error) throw error;
		} catch (e) {
			throw this._parseError(
				"delete photo",
				"Foto belum bisa dihapus. Coba lagi ya",
				e,
			);
		}
	}

	getPublicUrl(path: string, transform?: PhotoTransformOption) {
		try {
			const { data } = supabase.storage.from(this.bucket).getPublicUrl(path, {
				transform,
			});

			return data.publicUrl;
		} catch (e) {
			throw this._parseError(
				"get public photo url",
				"Foto tidak bisa dimuat. Coba lagi ya",
				e,
			);
		}
	}

	async getRecentPhotos(path: string, limit = 100) {
		const { data, error } = await supabase.storage
			.from(this.bucket)
			.list(path, {
				limit,
				sortBy: {
					column: "created_at",
					order: "desc",
				},
			});

		if (error) {
			throw this._parseError(
				"get recent photos",
				"Foto tidak bisa dimuat. Coba lagi ya",
				error,
			);
		}

		return data ?? [];
	}

	async getPrivateUrl(
		path: string,
		transform?: PhotoTransformOption,
	): Promise<string> {
		const key = transform
			? `${path}?w=${transform.width}&h=${transform.height}&q=${transform.quality}`
			: path;

		const cached = this._urlCache.get(key);
		if (cached && cached.expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
			return cached.url;
		}

		// createSignedUrls has no transform option, so transforms can't be batched
		if (transform) return this._fetchSingle(path, key, transform);

		return this._enqueue(path);
	}

	private _enqueue(path: string): Promise<string> {
		// same path requested twice before the flush -> share one promise
		const existing = this._inflight.get(path);
		if (existing) return existing;

		const promise = new Promise<string>((resolve, reject) => {
			this._pending.set(path, { resolve, reject });
		}).finally(() => this._inflight.delete(path));

		this._inflight.set(path, promise);
		this._flush();
		return promise;
	}

	private async _flushPending() {
		const batch = new Map(this._pending);
		this._pending.clear();
		if (batch.size === 0) return;

		try {
			const { error, data } = await supabase.storage
				.from(this.bucket)
				.createSignedUrls([...batch.keys()], SIGNED_URL_EXPIRATION, {
					download: true,
				});

			if (error) throw error;

			const byPath = new Map((data ?? []).map((item) => [item.path, item]));

			for (const [path, request] of batch) {
				const item = byPath.get(path);

				if (item?.signedUrl && !item.error) {
					this._urlCache.set(path, {
						url: item.signedUrl,
						expiresAt: Date.now() + SIGNED_URL_EXPIRATION * 1000,
					});
					request.resolve(item.signedUrl);
				} else {
					request.reject(
						this._parseError(
							"get private photo url",
							"Foto tidak bisa dimuat. Coba lagi ya",
							new Error(item?.error ?? "No signed url returned"),
						),
					);
				}
			}
		} catch (e) {
			const err = this._parseError(
				"get private photo url",
				"Foto tidak bisa dimuat. Coba lagi ya",
				e,
			);

			for (const [, request] of batch) {
				request.reject(err);
			}
		}
	}

	private async _fetchSingle(
		path: string,
		key: string,
		transform: PhotoTransformOption,
	): Promise<string> {
		try {
			const { error, data } = await supabase.storage
				.from(this.bucket)
				.createSignedUrl(path, SIGNED_URL_EXPIRATION, {
					download: true,
					transform,
				});

			if (error) throw error;
			if (!data)
				throw new Error("Private url created but no data was returned");

			this._urlCache.set(key, {
				url: data.signedUrl,
				expiresAt: Date.now() + SIGNED_URL_EXPIRATION * 1000,
			});

			return data.signedUrl;
		} catch (e) {
			throw this._parseError(
				"get private photo url",
				"Foto tidak bisa dimuat. Coba lagi ya",
				e,
			);
		}
	}

	private _parseError(
		action: string,
		ui_message: string,
		e: unknown,
	): ServerError {
		if (e instanceof ServerError) return e;
		const message = e instanceof Error ? e.message : `Failed to ${action}`;

		return new ServerError({
			status: 500,
			message: `${action} error: ${message}`,
			ui_message,
		});
	}
}
