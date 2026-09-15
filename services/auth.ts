import { supabase } from "@/lib/supabase";
import { appInfoKeys } from "@/lib/supabase/database.consts";

const getAuthDomainName = async (): Promise<string> => {
	const { data, error } = await supabase
		.from("app_public_informations")
		.select("value")
		.eq("key", appInfoKeys.authEmailDomain)
		.single();

	if (error) throw error;
	return data.value;
};

const useUsernameForEmail = (username: string, authDomain: string) =>
	`${username}@${authDomain}`;

export const authenticate = async (username: string, password: string) => {
	const authDomain = await getAuthDomainName();

	const result = await supabase.auth.signInWithPassword({
		email: useUsernameForEmail(username, authDomain),
		password,
	});

	return result;
};

export const getMyId = async () => {
	const user = await supabase.auth.getUser();

	return user.data.user?.id;
};

export const getRole = async (): Promise<"teacher" | "student" | null> => {
	const user = (await supabase.auth.getUser()).data.user;

	return user?.app_metadata.user_role;
};

export const logout = async () => {
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw error;
	}
};
