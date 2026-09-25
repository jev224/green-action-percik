import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";

export async function fetchMotiovations() {
	const { data, error } = await supabase.from("motivations").select("*");

	if (error) {
		throw new ServerError({
			message: `Cannot fetch motivations data${error}`,
			status: 500,
			ui_message: "Terjadi kesalahan.",
		});
	}

	return data ?? [];
}
