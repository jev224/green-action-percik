import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { getPublicInfoValue } from "../client/serverInformation";

const AUTH_EMAIL_DOMAIN_KEY = "auth_email_domain";

const buildAuthEmail = (username: string, authDomain: string) =>
	`${username}@${authDomain}`;

export const authenticate = async (username: string, password: string) => {
	const authDomain = await getPublicInfoValue(AUTH_EMAIL_DOMAIN_KEY);

	const { error, data } = await supabase.auth.signInWithPassword({
		email: buildAuthEmail(username, authDomain),
		password,
	});

	if (!data.user) {
		throw new ServerError({
			status: 500,
			message: "Sign-in succeeded but no user was returned",
			ui_message: "Terjadi kendala saat login. Coba lagi ya",
		});
	}

	if (error) {
		switch (error.code) {
			case "invalid_credentials":
				throw new ServerError({
					status: 401,
					message: error.message,
					ui_message: "Username atau password salah",
				});

			case "email_address_invalid":
				throw new ServerError({
					status: 400,
					message: error.message,
					ui_message: "Format username tidak valid",
				});

			case "email_not_confirmed":
				throw new ServerError({
					status: 403,
					message: error.message,
					ui_message: "Akun kamu belum dikonfirmasi",
				});

			case "user_banned":
				throw new ServerError({
					status: 403,
					message: error.message,
					ui_message: "Akun kamu sedang dibatasi",
				});

			case "over_request_rate_limit":
			case "over_email_send_rate_limit":
				throw new ServerError({
					status: 429,
					message: error.message,
					ui_message: "Terlalu banyak percobaan. Coba lagi nanti",
				});

			case "provider_disabled":
			case "email_provider_disabled":
				throw new ServerError({
					status: 503,
					message: error.message,
					ui_message: "Layanan login sedang tidak tersedia",
				});

			default:
				throw new ServerError({
					status: 500,
					message: error.message,
					ui_message: "Terjadi kendala saat login. Coba lagi ya",
				});
		}
	}

	return data.user;
};

export const logout = async () => {
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw new ServerError({
			status: 500,
			message: `Failed to sign out: ${error.message}`,
			ui_message: "Gagal keluar dari akun. Coba lagi ya",
		});
	}
};
