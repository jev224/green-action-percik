import { File } from "expo-file-system";

import { supabase } from "@/lib/supabase";

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
		console.log("Session at upload time:", path);

		const file = new File(localUri);
		const arrayBuffer = await file.arrayBuffer();

		const { error, data } = await supabase.storage
			.from(this.bucket)
			.upload(path, arrayBuffer, { contentType: IMAGE_CONTENT_TYPE, upsert });

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Upload succeeded but no data was returned");
		}

		return data;
	}

	async replace(path: string, localUri: string) {
		const file = new File(localUri);
		const arrayBuffer = await file.arrayBuffer();

		const { error, data } = await supabase.storage
			.from(this.bucket)
			.update(path, arrayBuffer, { contentType: IMAGE_CONTENT_TYPE });

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Replace succeeded but no data was returned");
		}

		return data.id;
	}

	async remove(path: string | string[]) {
		const pathArray = Array.isArray(path) ? path : [path];

		const { error } = await supabase.storage
			.from(this.bucket)
			.remove(pathArray);

		if (error) {
			throw error;
		}
	}

	async getPrivateUrl(
		path: string,
		transform?: PhotoTransformOption,
	): Promise<string> {
		const { error, data } = await supabase.storage
			.from(this.bucket)

			.createSignedUrl(path, SIGNED_URL_EXPIRATION, {
				download: true,
				transform,
			});

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Private url created but no data was returned");
		}

		return data.signedUrl;
	}

	getPublicUrl(path: string, transform?: PhotoTransformOption) {
		const { data } = supabase.storage.from(this.bucket).getPublicUrl(path, {
			transform,
		});

		return data.publicUrl;
	}
}
