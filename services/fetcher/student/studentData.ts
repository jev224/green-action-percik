import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";

export async function updateStudentData(
	userId: string,
	values: Database["public"]["Tables"]["students"]["Update"],
) {
	const { error } = await supabase
		.from("students")
		.update(values)
		.eq("user_id", userId);

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to update student data: ${error.message}`,
			ui_message: "Data siswa belum berhasil diperbarui. Coba lagi ya.",
		});
	}
}
