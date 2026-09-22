import { supabase } from "@/lib/supabase";
import type { LessonContent } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { lessonPhotos, TABLE_NAME } from "./lessonQuery";

export type LessonFields = {
	title: string;
	description: string;
	contents: LessonContent[];
	photoUri?: string | null;
};

export type LessonForm = LessonFields;

const lessonPhotoPath = (id: number) => `${Date.now()}_${id}.jpeg`;

async function uploadPhoto(id: number, photoUri?: string | null) {
	try {
		if (photoUri) {
			const result = await lessonPhotos.upload(lessonPhotoPath(id), photoUri);
			return result.path;
		}

		return null;
	} catch (e) {
		const message =
			e instanceof Error ? e.message : "Failed to upload lesson photo";

		throw new ServerError({
			status: 500,
			message,
			ui_message: "Foto pelajarannya belum bisa diperbarui. Coba lagi ya",
		});
	}
}

async function deletePhoto(path: string) {
	try {
		await lessonPhotos.remove(path);
	} catch (e) {
		const message =
			e instanceof Error ? e.message : "Failed to delete lesson photo";

		throw new ServerError({
			status: 500,
			message,
			ui_message: "Foto pelajarannya belum bisa dihapus. Coba lagi ya",
		});
	}
}

export async function createLesson(author: string, insert: LessonFields) {
	const { photoUri, ...insertFields } = insert;

	const { error: createError, data } = await supabase
		.from(TABLE_NAME)
		.insert({ author, ...insertFields })
		.select("id")
		.single();

	if (createError) {
		throw new ServerError({
			status: 500,
			message: `Failed to create lesson: ${createError.message}`,
			ui_message: "Pelajaran belum bisa dibuat. Coba lagi ya",
		});
	}

	if (photoUri && data) {
		const photo = await uploadPhoto(data.id, photoUri);

		const { error: photoError } = await supabase
			.from(TABLE_NAME)
			.update({ photo })
			.eq("id", data.id);

		if (photoError) {
			throw new ServerError({
				status: 500,
				message: `Failed to attach photo to lesson with id ${data.id}: ${photoError.message}`,
				ui_message:
					"Pelajarannya berhasil dibuat, tapi fotonya belum bisa disimpan. Coba tambahkan fotonya lagi ya",
			});
		}
	}
}

export async function deleteLesson(id: number, photoPath: string) {
	const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

	if (error) {
		throw new ServerError({
			status: error.code === "PGRST116" ? 404 : 500,
			message: `Failed to remove lesson with id ${id}: ${error.message}`,
			ui_message:
				error.code === "PGRST116"
					? "Pelajaran yang mau dihapus nggak ditemukan"
					: "Pelajarannya belum bisa dihapus. Coba lagi ya",
		});
	}

	await deletePhoto(photoPath);
}

export async function updateLesson(
	id: number,
	originalPhotoPath: string | undefined,
	patch: Partial<LessonFields>,
) {
	if (Object.keys(patch).length === 0) {
		return;
	}

	const { photoUri, ...updateFields } = patch;

	let photo: string | null | undefined;
	let photoToCleanup: string | null = null;

	try {
		// photoUri === null means the caller explicitly removed the photo
		if (originalPhotoPath && photoUri === null) {
			photo = null;
			photoToCleanup = originalPhotoPath;
		}

		if (photoUri) {
			photo = await uploadPhoto(id, photoUri);
			photoToCleanup = originalPhotoPath ?? null;
		}
	} catch (_e) {
		throw new ServerError({
			status: 500,
			message: `Failed to update lesson with id ${id}`,
			ui_message: "Pelajarannya belum bisa diperbarui. Coba lagi ya",
		});
	}

	const { error } = await supabase
		.from(TABLE_NAME)
		.update({ ...updateFields, photo })
		.eq("id", id);

	if (error) {
		throw new ServerError({
			status: error.code === "PGRST116" ? 404 : 500,
			message: `Failed to update lesson with id ${id}: ${error.message}`,
			ui_message:
				error.code === "PGRST116"
					? "Pelajaran yang mau diperbarui nggak ditemukan"
					: "Pelajarannya belum bisa diperbarui. Coba lagi ya",
		});
	}

	if (photoToCleanup) {
		await deletePhoto(photoToCleanup);
	}
}

export const getChangedLessonFields = (
	original: Partial<LessonForm>,
	current: LessonForm,
): Partial<LessonForm> => {
	const changed: Partial<LessonForm> = {};

	if (original.title !== current.title) {
		changed.title = current.title;
	}

	if (original.description !== current.description) {
		changed.description = current.description;
	}

	if (original.photoUri !== current.photoUri) {
		changed.photoUri = current.photoUri;
	}

	// Content blocks are always edited/reordered as a whole, so a JSON
	// comparison is cheap enough here and avoids a manual deep-diff.
	if (JSON.stringify(original.contents) !== JSON.stringify(current.contents)) {
		changed.contents = current.contents;
	}

	return changed;
};

export { fetchAllLessons, fetchLesson } from "./lessonQuery";
