import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { PhotoStorage } from "@/services/storage/photo";
import type { StringKeys } from "@/types";

export type UserRole = "teacher" | "student";

export type ProfileByRoleBase<R extends UserRole> = R extends "teacher"
	? TeacherProfile
	: StudentProfile;

export type ProfileByRole<R extends UserRole> = ProfileByRoleBase<R> & {
	photoUrl?: string;
	user_id: string;
};

type StudentProfile = Database["public"]["Tables"]["students"]["Row"] & {
	class: Database["public"]["Tables"]["classes"]["Row"];
};

type TeacherProfile = Database["public"]["Tables"]["teachers"]["Row"];

export const profilePicture = new PhotoStorage("profile_picture");

export const withProfilePicture = async <
	T extends object,
	K extends StringKeys<T>,
>(
	data: T,
	photoProp: K,
) => ({
	...data,
	photoUrl: data[photoProp]
		? await profilePicture.getPrivateUrl(data[photoProp] as string)
		: undefined,
});

export async function getProfileByRole<R extends UserRole>(
	id: string,
	role: R,
): Promise<ProfileByRole<R>> {
	let dbError: PostgrestError | undefined | null;
	let dbData: StudentProfile | TeacherProfile | undefined | null;

	if (role === "teacher") {
		const { error, data } = await supabase
			.from("teachers")
			.select("*")
			.eq("user_id", id)
			.single();

		dbError = error;
		dbData = data;
	} else {
		const { error, data } = await supabase
			.from("students")
			.select("*, class:classes(id, grade, major, sub_major)")
			.eq("user_id", id)
			.single();

		dbError = error;
		dbData = data;
	}

	if (dbError) {
		if (dbError.code === "PGRST116") {
			throw new ServerError({
				status: 404,
				message: `Profile not found for user ${id} with role ${role}`,
				ui_message: "Profil kamu belum ditemukan",
			});
		}

		throw new ServerError({
			status: 500,
			message: `Failed to fetch ${role} profile: ${dbError.message}`,
			ui_message: "Profil kamu belum bisa dimuat. Coba lagi ya",
		});
	}

	if (!dbData?.user_id) {
		throw new ServerError({
			status: 500,
			message: `Profile fetched with no data.`,
			ui_message: "Profil kamu belum bisa dimuat. Coba lagi ya",
		});
	}

	return (await withProfilePicture(
		dbData,
		"photo",
	)) as unknown as ProfileByRole<R>;
}

export async function getUserData() {
	const user =
		(await supabase.auth.getSession()).data.session?.user ||
		(await supabase.auth.getUser()).data.user;

	if (!user) return null;

	return {
		id: user.id,
		role: user.app_metadata.user_role as UserRole,
	};
}
