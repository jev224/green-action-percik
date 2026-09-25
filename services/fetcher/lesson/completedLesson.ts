import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";

export async function fetchCompletedLessonsData(studentId: string) {
	const { error, data } = await supabase
		.from("completed_lessons")
		.select("*")
		.eq("student_id", studentId);

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch completed lessons: ${error}`,
			ui_message: "Yah, daftar pelajarannya belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}

export async function insertCompletedLesson(
	lesson_id: number,
	student_id: string,
) {
	// Guard: return early if already completed
	const { data: existing, error: checkError } = await supabase
		.from("completed_lessons")
		.select("lesson_id")
		.eq("lesson_id", lesson_id)
		.eq("student_id", student_id)
		.maybeSingle();

	if (checkError) {
		throw new ServerError({
			status: 500,
			message: `Failed to check completed lesson: ${checkError.message}`,
			ui_message: "Terjadi kesalahan. Coba lagi ya",
		});
	}

	if (existing) return;

	const { error } = await supabase
		.from("completed_lessons")
		.upsert({ lesson_id, student_id });

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to insesrt completed lessons: ${error}`,
			ui_message: "Terjadi kesalahan. Coba lagi ya",
		});
	}
}
