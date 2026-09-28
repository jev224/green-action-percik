import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { PhotoStorage } from "@/services/storage/photo";
import type { LessonContent } from "@/stores/lesson";
import type { StringKeys } from "@/types";

type LessonData = Omit<
	Database["public"]["Tables"]["learning_lessons"]["Row"],
	"contents"
> & {
	photoUrl?: string | null;
	contents: LessonContent[];
};

export const TABLE_NAME =
	"learning_lessons" satisfies keyof Database["public"]["Tables"];
export const lessonPhotos = new PhotoStorage("lesson_photo");

const withPhoto = <T extends object, K extends StringKeys<T>>(
	data: T,
	photoProp: K,
) => ({
	...data,
	photoUrl: data[photoProp]
		? lessonPhotos.getPublicUrl(data[photoProp] as string)
		: null,
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

	return withPhoto(data, "photo") as LessonData;
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

	return (data ?? []).map((data) => withPhoto(data, "photo")) as LessonData[];
}
