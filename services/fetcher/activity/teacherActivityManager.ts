import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { getPublicInfoValue } from "../client/serverInformation";
import { activityPhotos } from "./studentActivitySubmission";

export type WasteBankPatch =
	Database["public"]["Tables"]["waste_banks"]["Update"];

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

export async function updateWasteBank(id: number, patch: WasteBankPatch) {
	const { error } = await supabase
		.from("waste_banks")
		.update(patch)
		.eq("id", id);

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to update waste bank: ${error.message}`,
			ui_message: "Daftar bank sampah tidak bisa diperbarui. Coba lagi ya",
		});
	}
}

export async function deleteWasteBank(id: number) {
	const { data: activities, error: selectError } = await supabase
		.from("waste_banks")
		.select("photo")
		.eq("id", id);

	if (selectError) {
		throw new ServerError({
			status: 500,
			message: `Failed to find selected waste_banks activities: ${selectError.message}`,
			ui_message: `Bank sampah belum bisa dihapus. Coba lagi ya`,
		});
	}

	const photos = (activities ?? [])
		.map(({ photo }) => photo)
		.filter((photo): photo is string => Boolean(photo));

	if (photos.length > 0) {
		await activityPhotos.remove(photos);
	}

	const { error: deleteError } = await supabase
		.from("waste_banks")
		.delete()
		.eq("id", id);

	if (deleteError) {
		throw new ServerError({
			status: 500,
			message: `Failed to delete selected waste_banks activities: ${deleteError.message}`,
			ui_message: "Bank sampah tidak bisa dihapus. Coba lagi ya",
		});
	}
}

export async function fetchWastePhotoURL(photo: string) {
	return await activityPhotos.getPrivateUrl(photo);
}

export async function fetchWastePriceMultiplier() {
	return await getPublicInfoValue("waste_price_multiplier_per_kg");
}
