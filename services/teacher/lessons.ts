import { supabase } from "@/lib/supabase";
import type { LessonContent } from "@/lib/supabase/database.types";
import { deletePhoto, getPhotoUrl, uploadPhoto } from "../photoStorage";
import { getTeacherName } from "./profile";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

export type LessonFields = {
	title: string;
	description: string;
	contents: LessonContent[];
};

export type LessonForm = LessonFields & { photoUri: string | null | undefined };

export type LessonPayload = LessonFields & {
	photoUri?: string | null;
};

export type CreateLessonParams = LessonPayload;

/**
 * Update only needs the fields that actually changed, plus the id.
 * `photoUri` meaning:
 *   - undefined -> untouched, keep whatever photo already exists
 *   - null      -> user removed the photo
 *   - string    -> new local file uri to upload
 */
export type UpdateLessonParams = Partial<LessonFields> & {
	id: number;
	photoUri?: string | null;
};

const LESSON_PHOTO_BUCKET = "lesson-photos";

const lessonPhotoPath = (id: number) => `${id}.jpg`;

const lessonPhotoUrl = (photo?: string | null): string | null =>
	photo ? getPhotoUrl(LESSON_PHOTO_BUCKET, photo) : null;

// ─────────────────────────────────────────────────────────────────
// Single place that writes to `learning_lessons` and throws on
// error — used by both mutations below instead of each one
// repeating the same update/error-check block for every field
// (title/description/contents, photo path, photo removal).
// ─────────────────────────────────────────────────────────────────

const updateLessonRow = async (
	id: number,
	patch: Partial<LessonFields> & { photo?: string | null },
) => {
	const { error } = await supabase
		.from("learning_lessons")
		.update(patch)
		.eq("id", id);

	if (error) {
		throw error;
	}
};

export const getChangedLessonFields = (
	original: Partial<LessonForm>,
	current: LessonForm,
): Partial<LessonForm> => {
	const changed: Partial<LessonForm> = {};

	if (original.title !== current.title) {
		changed.title = current.title;
	}

	if (original.description !== current.description) {
		changed.description = current.description;
	}

	if (original.photoUri !== current.photoUri) {
		changed.photoUri = current.photoUri;
	}

	// Content blocks are always edited/reordered as a whole, so a JSON
	// comparison is cheap enough here and avoids a manual deep-diff.
	if (JSON.stringify(original.contents) !== JSON.stringify(current.contents)) {
		changed.contents = current.contents;
	}

	return changed;
};

// ─────────────────────────────────────────────────────────────────
// READ QUERIES
// ─────────────────────────────────────────────────────────────────

export const getAllLessons = async () => {
	const { error: lessonError, data } = await supabase
		.from("learning_lessons")
		.select("id, title, description, photo");

	if (lessonError) {
		throw lessonError;
	}

	return data?.map((lesson) => ({
		...lesson,
		photoUrl: lessonPhotoUrl(lesson.photo),
	}));
};

export const getLessonDetails = async (id: number) => {
	const { error: lessonError, data } = await supabase
		.from("learning_lessons")
		.select("*")
		.eq("id", id)
		.single();

	if (lessonError) {
		throw lessonError;
	}

	return {
		...data,
		photoUrl: lessonPhotoUrl(data.photo),
	};
};

// ─────────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────────

export const createNewLesson = async ({
	title,
	description,
	contents,
	photoUri,
}: CreateLessonParams) => {
	const author = await getTeacherName();

	// Create the lesson first so we have an id to key the photo path on.
	const { data, error } = await supabase
		.from("learning_lessons")
		.insert({ title, description, contents, author })
		.select("id")
		.single();

	if (error) {
		throw error;
	}

	const lessonId = data.id;

	if (!photoUri) {
		return data;
	}

	const storagePath = await uploadPhoto(
		LESSON_PHOTO_BUCKET,
		lessonPhotoPath(lessonId),
		photoUri,
	);

	await updateLessonRow(lessonId, { photo: storagePath });

	return data;
};

export const updateLesson = async ({
	id,
	photoUri,
	...fields
}: UpdateLessonParams) => {
	// `fields` only contains keys the caller actually decided changed
	// (see getChangedLessonFields) — skip the query entirely if there's
	// nothing here, instead of always re-writing title/description/contents.
	if (Object.keys(fields).length > 0) {
		await updateLessonRow(id, fields);
	}

	// undefined = photo untouched, nothing more to do
	if (photoUri === undefined) {
		return;
	}

	// null = user removed the existing photo
	if (photoUri === null) {
		await deletePhoto(LESSON_PHOTO_BUCKET, lessonPhotoPath(id));

		// Must be `null`, not `undefined` — JSON serializers (incl.
		// supabase-js) drop `undefined` keys entirely, so `undefined`
		// here would silently no-op and never actually clear the column.
		await updateLessonRow(id, { photo: null });

		return;
	}

	// Otherwise photoUri is a new local file uri to upload.
	const storagePath = await uploadPhoto(
		LESSON_PHOTO_BUCKET,
		lessonPhotoPath(id),
		photoUri,
	);

	await updateLessonRow(id, { photo: storagePath });
};
