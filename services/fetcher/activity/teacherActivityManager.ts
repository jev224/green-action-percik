import type { PostgrestFilterBuilder } from "@supabase/supabase-js";
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

export async function fetchUnpaidStudents() {
	return await getPublicInfoValue("waste_price_multiplier_per_kg");
}

export async function fetchWastePhotoURL(photo: string) {
	return await activityPhotos.getPrivateUrl(photo);
}

export async function fetchWastePriceMultiplier() {
	return await getPublicInfoValue("waste_price_multiplier_per_kg");
}

export async function fetchAllUnpaidStudentsWaste() {
	const { error, data } = await supabase.rpc(
		"students_with_unpaid_waste_banks",
	);

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch ALL unpaid student waste: ${error.message}`,
			ui_message: `Terjadi kesalahan. Coba lagi ya${error.message}`,
		});
	}

	return data;
}

export async function fetchUnpaidStudentWaste(studentId: string) {
	const { error, data } = await supabase.rpc("get_unpaid_student_waste_total", {
		p_student_id: studentId,
	});

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch unpaid student waste: ${error.message}`,
			ui_message: "Terjadi kesalahan. Coba lagi ya",
		});
	}

	return data;
}

export async function payAllUnpaidStudentWaste(studentId: string) {
	const { error } = await supabase
		.from("waste_banks")
		.update({ paid: true })
		.eq("student_id", studentId);

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to PAY unpaid student waste: ${error.message}`,
			ui_message: "Terjadi kesalahan. Coba lagi ya",
		});
	}
}

function applyDateRange<
	// biome-ignore lint/suspicious/noExplicitAny: Supabase query builder generics
	T extends PostgrestFilterBuilder<any, any, any, any>,
>(query: T, start?: Date, end?: Date) {
	if (start) {
		query = query.gte("created_at", start.toISOString());
	}

	if (end) {
		query = query.lte("created_at", end.toISOString());
	}

	return query;
}

export async function fetchAllCompostActivities(start?: Date, end?: Date) {
	let query = supabase.from("compost_activities").select("*");

	query = applyDateRange(query, start, end);

	const { error, data } = await query;

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch all compost activities: ${error.message}`,
			ui_message: "Daftar kegiatan kompos belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}

export async function fetchAllCompostParticipants(start?: Date, end?: Date) {
	let query = supabase.from("compost_participants").select("*");

	query = applyDateRange(query, start, end);

	const { error, data } = await query;

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch all compost participants: ${error.message}`,
			ui_message:
				"Daftar peserta kegiatan kompos belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}
export async function fetchAllWasteBanks(start?: Date, end?: Date) {
	let query = supabase.from("waste_banks").select("*");

	query = applyDateRange(query, start, end);

	const { error, data } = await query;

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch all waste banks: ${error.message}`,
			ui_message: "Daftar bank sampah belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}

export async function fetchAllGardenActivities(start?: Date, end?: Date) {
	let query = supabase.from("garden_activities").select("*");

	query = applyDateRange(query, start, end);

	const { error, data } = await query;

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to fetch all garden activities: ${error.message}`,
			ui_message: "Daftar kegiatan kebun belum bisa dimuat. Coba lagi ya",
		});
	}

	return data ?? [];
}
