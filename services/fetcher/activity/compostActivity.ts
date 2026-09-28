import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { PhotoStorage } from "@/services/storage/photo";
import type { ClassData } from "@/types";
import { formatClassPathSegment, getWeekRange } from "@/utils";
import { getProfileByRole, type UserRole } from "../account/profile";

export const compostPhotos = new PhotoStorage("compost_activity_photo");

const buildCompostPhotoPath = (
	id: number,
	classData: ClassData,
	timestamptz: string,
) => `${id}_Kelas_${formatClassPathSegment(classData)}/${timestamptz}.jpg`;

export async function submitCompostActivity(
	role: UserRole,
	userId: string,
	classId: number,
	classData: ClassData,
	photoUri: string,
	allStudentIds: string[],
	allAttendedIds: string[],
) {
	const nowTimestamptz = new Date().toISOString();

	const { path } = await compostPhotos.upload(
		buildCompostPhotoPath(classId, classData, nowTimestamptz),
		photoUri,
	);

	const { error: createError, data } = await supabase
		.from("compost_activities")
		.upsert({
			class_id: classId,
			submitted_by: userId,
			submitted_by_role: role,
			photo: path,
			created_at: nowTimestamptz,
		})
		.select("id")
		.single();

	if (createError || !data) {
		throw new ServerError({
			status: 500,
			message: `Failed to submit: ${createError?.message ?? "No data returned"}`,
			ui_message: "Kegiatan belum bisa di-kirim. Coba lagi ya",
		});
	}

	const attendedSet = new Set(allAttendedIds);

	const participatns = allStudentIds.map((id) => ({
		compost_activity_id: data.id,
		student_id: id,
		attended: attendedSet.has(id),
	}));

	const { error: attendanceError } = await supabase
		.from("compost_participants")
		.insert(participatns);

	if (attendanceError) {
		throw new ServerError({
			status: 500,
			message: `Failed to insert attandance: ${attendanceError.message}`,
			ui_message: "Kegiatan belum bisa di-kirim. Coba lagi ya",
		});
	}
}

export async function isCompostActivitySubmitted(classId: number) {
	const { startOfWeek, endOfWeek } = getWeekRange();

	const { error, data } = await supabase
		.from("compost_activities")
		.select("*")
		.eq("class_id", classId)
		.gte("created_at", startOfWeek.toISOString())
		.lt("created_at", endOfWeek.toISOString())
		.maybeSingle();

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to get submiited info: ${error.message}`,
			ui_message: "Gagal dalam mendapatkan info kegiatan.",
		});
	}

	if (data?.submitted_by) {
		const profile = await getProfileByRole(
			data.submitted_by,
			data.submitted_by_role as UserRole,
		);

		return {
			activityId: data?.id,
			submitted: true as true,
			submittedBy: data.submitted_by,
			submittedByRole: data.submitted_by_role as UserRole,
			submittedAuthor: profile.name,
		};
	}

	if (data) {
		return {
			activityId: data?.id,
			submitted: true as true,
			submittedByRole: data.submitted_by_role as UserRole,
		};
	}

	return {
		submitted: false as false,
	};
}

export async function deleteSubmittedCompostActivity(classId: number) {
	const { startOfWeek, endOfWeek } = getWeekRange();
	const start = startOfWeek.toISOString();
	const end = endOfWeek.toISOString();

	const { data: activities, error: selectError } = await supabase
		.from("compost_activities")
		.select("photo")
		.eq("class_id", classId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (selectError) {
		throw new ServerError({
			status: 500,
			message: `Failed to find submitted compost activities: ${selectError.message}`,
			ui_message: "Kegiatan kompos belum bisa dihapus. Coba lagi ya",
		});
	}

	const photos = (activities ?? [])
		.map(({ photo }) => photo)
		.filter((photo): photo is string => Boolean(photo));

	if (photos.length > 0) {
		await compostPhotos.remove(photos);
	}

	const { error: deleteError } = await supabase
		.from("compost_activities")
		.delete()
		.eq("class_id", classId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (deleteError) {
		throw new ServerError({
			status: 500,
			message: `Failed to delete submitted compost activities: ${deleteError.message}`,
			ui_message: "Kegiatan kompos belum bisa dihapus. Coba lagi ya",
		});
	}
}
