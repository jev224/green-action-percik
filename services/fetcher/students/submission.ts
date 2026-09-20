import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { getDayRange } from "@/utils";

import {
	baseActivityPhotoPath,
	type ClassData,
	deletePhoto,
	uploadPhoto,
} from "../shared/activity";

const gardenPhotoPath = (
	id: number,
	fullName: string,
	classData: ClassData,
	timestamptz: string,
) => `Garden/${baseActivityPhotoPath(id, fullName, classData, timestamptz)}`;

export async function submitGardenActivity(
	id: number,
	userId: string,
	fullName: string,
	classData: ClassData,
	type: string,
	location: string,
	photoUri: string,
) {
	const nowTimestamptz = new Date().toISOString();

	const photo = await uploadPhoto(
		gardenPhotoPath(id, fullName, classData, nowTimestamptz),
		photoUri,
	);

	const { error: createError } = await supabase
		.from("garden_activities")
		.upsert({
			student_id: userId,
			activity_type: type,
			location,
			photo,
			created_at: nowTimestamptz,
		});

	if (createError) {
		throw new ServerError({
			status: 500,
			message: `Failed to submit: ${createError?.message ?? "No data returned"}`,
			ui_message: "Kegiatan belum bisa di-kirim. Coba lagi ya",
		});
	}
}

export async function isGardenActivitySubmitted(studentId: string) {
	const { startOfDay, endOfDay } = getDayRange();

	const { error, count } = await supabase
		.from("garden_activities")
		.select("*", { count: "exact", head: true })
		.eq("student_id", studentId)
		.gte("created_at", startOfDay.toISOString())
		.lt("created_at", endOfDay.toISOString());

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to get submiited info: ${error.message}`,
			ui_message: "Gagal dalam mendapatkan info kegiatan.",
		});
	}

	return {
		submitted: count !== 0,
	};
}

export async function deleteSubmittedGardenActivity(studentId: string) {
	const { startOfDay, endOfDay } = getDayRange();
	const start = startOfDay.toISOString();
	const end = endOfDay.toISOString();

	const { data: activities, error: selectError } = await supabase
		.from("garden_activities")
		.select("photo")
		.eq("student_id", studentId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (selectError) {
		throw new ServerError({
			status: 500,
			message: `Failed to find submitted garden activities: ${selectError.message}`,
			ui_message: "Kegiatan kebun belum bisa dihapus. Coba lagi ya",
		});
	}

	const photos = (activities ?? [])
		.map(({ photo }) => photo)
		.filter((photo): photo is string => Boolean(photo));

	if (photos.length > 0) {
		await deletePhoto(photos);
	}

	const { error: deleteError } = await supabase
		.from("garden_activities")
		.delete()
		.eq("student_id", studentId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (deleteError) {
		throw new ServerError({
			status: 500,
			message: `Failed to delete submitted garden activities: ${deleteError.message}`,
			ui_message: "Kegiatan kebun belum bisa dihapus. Coba lagi ya",
		});
	}
}

const wasteBankPhotoPath = (
	id: number,
	fullName: string,
	classData: ClassData,
	timestamptz: string,
) =>
	`Waste Bank/${baseActivityPhotoPath(id, fullName, classData, timestamptz)}`;

export async function submitWasteActivity(
	id: number,
	userId: string,
	fullName: string,
	classData: ClassData,
	category: string,
	photoUri: string,
) {
	const nowTimestamptz = new Date().toISOString();

	const photo = await uploadPhoto(
		wasteBankPhotoPath(id, fullName, classData, nowTimestamptz),
		photoUri,
	);

	const { error: createError } = await supabase.from("waste_banks").upsert({
		student_id: userId,
		category,
		weight: 0,
		price: 0,
		photo,
		created_at: nowTimestamptz,
	});

	if (createError) {
		throw new ServerError({
			status: 500,
			message: `Failed to submit: ${createError?.message ?? "No data returned"}`,
			ui_message: "Kegiatan belum bisa di-kirim. Coba lagi ya",
		});
	}
}

export async function isWasteActivitySubmitted(studentId: string) {
	const { startOfDay, endOfDay } = getDayRange();

	const { error, count } = await supabase
		.from("waste_banks")
		.select("*", { count: "exact", head: true })
		.eq("student_id", studentId)
		.gte("created_at", startOfDay.toISOString())
		.lt("created_at", endOfDay.toISOString());

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to get submiited info: ${error.message}`,
			ui_message: "Gagal dalam mendapatkan info kegiatan.",
		});
	}

	return {
		submitted: count !== 0,
	};
}

export async function deleteSubmittedWasteActivity(studentId: string) {
	const { startOfDay, endOfDay } = getDayRange();
	const start = startOfDay.toISOString();
	const end = endOfDay.toISOString();

	const { data: activities, error: selectError } = await supabase
		.from("waste_banks")
		.select("photo")
		.eq("student_id", studentId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (selectError) {
		throw new ServerError({
			status: 500,
			message: `Failed to find submitted waste activities: ${selectError.message}`,
			ui_message: "Kegiatan sampah belum bisa dihapus. Coba lagi ya",
		});
	}

	const photos = (activities ?? [])
		.map(({ photo }) => photo)
		.filter((photo): photo is string => Boolean(photo));

	if (photos.length > 0) {
		await deletePhoto(photos);
	}

	const { error: deleteError } = await supabase
		.from("waste_banks")
		.delete()
		.eq("student_id", studentId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (deleteError) {
		throw new ServerError({
			status: 500,
			message: `Failed to delete submitted waste activities: ${deleteError.message}`,
			ui_message: "Kegiatan sampah belum bisa dihapus. Coba lagi ya",
		});
	}
}
