import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";

export async function fetchCompostActivities() {
	const { error, data } = await supabase
		.from("classes")
		.select("*,  compost:compost_activities(*)");

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch compost activity: ${error.message}`,
			ui_message: "Daftar Kegiatan kompos belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}

export async function fetchWasteBanks() {
	const { error, data } = await supabase
		.from("waste_banks")
		.select("*, student:students(name)");

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch waste banks activity: ${error.message}`,
			ui_message: "Daftar bank sampah belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}
