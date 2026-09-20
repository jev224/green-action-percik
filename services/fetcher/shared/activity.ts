import { ServerError } from "@/services/ServerError";
import { PhotoStorage } from "@/services/storage/photo";
import { parseProfileInfo } from "@/utils";

export interface ClassData {
	grade: string;
	major: string;
	sub_major?: string;
}

export const activityPhotos = new PhotoStorage("activity_photo");

export const baseActivityPhotoPath = (
	id: number,
	fullName: string,
	classData: ClassData,
	timestamp: string,
) =>
	`${id}_${fullName}_${parseProfileInfo({ role: "student", ...classData }, true)}/${timestamp}.jpg`;

export async function uploadPhoto(path: string, photoUri: string) {
	try {
		const result = await activityPhotos.upload(path, photoUri);
		return result.path;
	} catch (e) {
		const message =
			e instanceof Error ? e.message : "Failed to upload activity photo";

		throw new ServerError({
			status: 500,
			message: `Upload photo error: ${message}`,
			ui_message: "Foto belum bisa diupload. Coba lagi ya",
		});
	}
}

export async function deletePhoto(path: string[]) {
	try {
		await activityPhotos.remove(path);
	} catch (e) {
		const message =
			e instanceof Error ? e.message : "Failed to delete activity photo";

		throw new ServerError({
			status: 500,
			message: `Delete photo error: ${message}`,
			ui_message: "Foto belum bisa dihapus. Coba lagi ya",
		});
	}
}
