import { supabase } from "@/lib/supabase";
import type { TableName } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { PhotoStorage } from "@/services/storage/photo";
import type { StringKeys } from "@/types";

export const TABLE_NAME = "learning_lessons" satisfies TableName;
export const lessonPhotos = new PhotoStorage("lesson_photo");

export const withPhoto = <T extends object, K extends StringKeys<T>>(
	data: T,
	photoProp: K,
) => ({
	...data,
	photoUrl: data[photoProp]
		? lessonPhotos.getPublicUrl(data[photoProp] as string)
		: undefined,
});

export async function fetchLesson(id: number) {
	const { error, data } = await supabase
		.from(TABLE_NAME)
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch lesson with id ${id}`,
			ui_message: "Pelajarannya belum bisa dimuat. Coba lagi nanti.",
		});
	}

	return withPhoto(data, "photo");
}

export async function fetchAllLessons() {
	const { error, data } = await supabase
		.from(TABLE_NAME)
		.select("id, title, description, photo, created_at");

	if (error) {
		throw new ServerError({
			status: 500,
			message: "Failed to fetch lessons",
			ui_message: "Yah, daftar pelajarannya belum bisa dimuat. Coba lagi ya",
		});
	}

	return (data ?? []).map((data) => withPhoto(data, "photo"));
}
