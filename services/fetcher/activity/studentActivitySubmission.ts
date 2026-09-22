import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { PhotoStorage } from "@/services/storage/photo";
import type { ClassData } from "@/types";
import { formatClassPathSegment, getDayRange } from "@/utils";

export const activityPhotos = new PhotoStorage("student_activity_photo");

export const buildActivityPhotoPath = (
	id: number,
	name: string,
	classData: ClassData,
	timestamptz: string,
) => `${id}_${name}_${formatClassPathSegment(classData)}/${timestamptz}.jpg`;

// Restrict to the two tables this module actually manages, rather than
// accepting any TableName — keeps callers of submitActivity/etc. honest.
type StudentActivityTable = "garden_activities" | "waste_banks";

type ActivityInsert<T extends StudentActivityTable> =
	Database["public"]["Tables"][T]["Insert"];

// ---- shared core (not exported — internal to this module) ----

async function submitActivity<T extends StudentActivityTable>(
	table: T,
	photoFolder: string,
	id: number,
	userId: string,
	fullName: string,
	classData: ClassData,
	photoUri: string,
	extraFields: Omit<ActivityInsert<T>, "student_id" | "photo" | "created_at">,
) {
	const nowTimestamptz = new Date().toISOString();

	const { path } = await activityPhotos.upload(
		`${photoFolder}/${buildActivityPhotoPath(id, fullName, classData, nowTimestamptz)}`,
		photoUri,
	);

	const payload: ActivityInsert<T> = {
		student_id: userId,
		photo: path,
		created_at: nowTimestamptz,
		...extraFields,
	} as ActivityInsert<T>;

	// supabase-js's `.from()` overloads only resolve when `table` is a literal,
	// not a generic `T` — there's no clean way to express "pick the right
	// table's builder based on a generic parameter" with its current types.
	// Type safety is still enforced above (ActivityInsert<T>) and at each
	// call site (submitGardenActivity / submitWasteActivity), so this `any`
	// is scoped to just the builder call, not the data shape.
	// biome-ignore lint/suspicious/noExplicitAny: Explnation above.
	const { error } = await (supabase.from(table) as any).upsert(payload);

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to submit ${table} activity: ${error.message}`,
			ui_message: "Kegiatan belum bisa di-kirim. Coba lagi ya",
		});
	}
}

async function isActivitySubmitted(
	table: StudentActivityTable,
	studentId: string,
) {
	const { startOfDay, endOfDay } = getDayRange();

	const { error, count } = await supabase
		.from(table)
		.select("*", { count: "exact", head: true })
		.eq("student_id", studentId)
		.gte("created_at", startOfDay.toISOString())
		.lt("created_at", endOfDay.toISOString());

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to get submitted info for ${table}: ${error.message}`,
			ui_message: "Gagal dalam mendapatkan info kegiatan.",
		});
	}

	return { submitted: count !== 0 };
}

async function deleteSubmittedActivity(
	table: StudentActivityTable,
	uiLabel: string, // Indonesian word used in the ui_message, e.g. "kebun" / "sampah"
	studentId: string,
) {
	const { startOfDay, endOfDay } = getDayRange();
	const start = startOfDay.toISOString();
	const end = endOfDay.toISOString();

	const { data: activities, error: selectError } = await supabase
		.from(table)
		.select("photo")
		.eq("student_id", studentId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (selectError) {
		throw new ServerError({
			status: 500,
			message: `Failed to find submitted ${table} activities: ${selectError.message}`,
			ui_message: `Kegiatan ${uiLabel} belum bisa dihapus. Coba lagi ya`,
		});
	}

	const photos = (activities ?? [])
		.map(({ photo }) => photo)
		.filter((photo): photo is string => Boolean(photo));

	if (photos.length > 0) {
		await activityPhotos.remove(photos);
	}

	const { error: deleteError } = await supabase
		.from(table)
		.delete()
		.eq("student_id", studentId)
		.gte("created_at", start)
		.lt("created_at", end);

	if (deleteError) {
		throw new ServerError({
			status: 500,
			message: `Failed to delete submitted ${table} activities: ${deleteError.message}`,
			ui_message: `Kegiatan ${uiLabel} belum bisa dihapus. Coba lagi ya`,
		});
	}
}

// ---- garden ----

export const submitGardenActivity = (
	id: number,
	userId: string,
	fullName: string,
	classData: ClassData,
	type: string,
	location: string,
	photoUri: string,
) =>
	submitActivity(
		"garden_activities",
		"Garden",
		id,
		userId,
		fullName,
		classData,
		photoUri,
		{ activity_type: type, location },
	);

export const isGardenActivitySubmitted = (studentId: string) =>
	isActivitySubmitted("garden_activities", studentId);

export const deleteSubmittedGardenActivity = (studentId: string) =>
	deleteSubmittedActivity("garden_activities", "kebun", studentId);

// ---- waste ----

export const submitWasteActivity = (
	id: number,
	userId: string,
	fullName: string,
	classData: ClassData,
	category: string,
	photoUri: string,
) =>
	submitActivity(
		"waste_banks",
		"WasteBank",
		id,
		userId,
		fullName,
		classData,
		photoUri,
		{ category, weight: 0, price: 0 },
	);

export const isWasteActivitySubmitted = (studentId: string) =>
	isActivitySubmitted("waste_banks", studentId);

export const deleteSubmittedWasteActivity = (studentId: string) =>
	deleteSubmittedActivity("waste_banks", "sampah", studentId);
