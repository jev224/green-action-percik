import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { withProfilePicture } from "../shared/profile";

export const fetchAllStudents = async () => {
	const { error, data } = await supabase
		.from("students")
		.select("*, class:classes(grade, major, sub_major)");

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch all students: ${error.message}`,
			ui_message: "Daftar siswa belum bisa dimuat. Coba lagi ya",
		});
	}

	return Promise.all(
		data.map((student) => withProfilePicture(student, "photo")),
	);
};

export const fetchStudentProfile = async (userId: string) => {
	const { error, data } = await supabase
		.from("students")
		.select("*, class:classes(grade, major, sub_major)")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch all students: ${error.message}`,
			ui_message: "Daftar siswa belum bisa dimuat. Coba lagi ya",
		});
	}

	return await withProfilePicture(data, "photo");
};
