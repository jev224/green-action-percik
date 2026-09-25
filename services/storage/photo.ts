import { File } from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { ServerError } from "../ServerError";

const SIGNED_URL_EXPIRATION = 60 * 60; // 1 hour
const IMAGE_CONTENT_TYPE = "image/jpeg";

export interface PhotoTransformOption {
	width: number;
	height: number;
	quality: number;
}

export class PhotoStorage {
	constructor(private readonly bucket: string) {}

	async upload(path: string, localUri: string, upsert = true) {
		try {
			const file = new File(localUri);
			const arrayBuffer = await file.arrayBuffer();

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
			const file = new File(localUri);
			const arrayBuffer = await file.arrayBuffer();

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

	async getPrivateUrl(
		path: string,
		transform?: PhotoTransformOption,
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

			return data.signedUrl;
		} catch (e) {
			throw this._parseError(
				"get private photo url",
				"Foto tidak bisa dimuat. Coba lagi ya",
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
