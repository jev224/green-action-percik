import { supabase } from "@/lib/supabase";

export async function getPublicInfoValue(key: string): Promise<string> {
	const { data, error } = await supabase
		.from("app_public_informations")
		.select("value")
		.eq("key", key)
		.single();

	if (error) throw error;

	return data.value;
}
