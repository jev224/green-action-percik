import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";

export async function fetchAllStudentClasses() {
	const { error, data } = await supabase.from("classes").select("*");

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch ALL student classes: ${error.message}`,
			ui_message: "Daftar kelas belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}
