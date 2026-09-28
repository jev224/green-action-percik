import { supabase } from "@/lib/supabase";
import { getUserData } from "./profile";

type ChangePasswordResult = {
	isSuccessful: boolean;
	validationErrorMessage: string | null;
};

export const changePassword = async (
	oldPassword: string,
	newPassword: string,
	confirmation: string,
): Promise<ChangePasswordResult> => {
	// Validate input
	if (!oldPassword) {
		return {
			isSuccessful: false,
			validationErrorMessage: "Password lama wajib diisi",
		};
	}

	if (!newPassword) {
		return {
			isSuccessful: false,
			validationErrorMessage: "Password baru wajib diisi",
		};
	}

	if (newPassword === oldPassword) {
		return {
			isSuccessful: false,
			validationErrorMessage: "Password baru harus berbeda dari password lama",
		};
	}

	if (newPassword !== confirmation) {
		return {
			isSuccessful: false,
			validationErrorMessage: "Konfirmasi password tidak cocok",
		};
	}

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user?.email) {
		return {
			isSuccessful: false,
			validationErrorMessage: "Gagal mendapatkan data pengguna",
		};
	}

	// Get user role before changing the password
	const userData = await getUserData();

	// Verify old password
	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: oldPassword,
	});

	if (signInError) {
		return {
			isSuccessful: false,
			validationErrorMessage: "Password lama salah",
		};
	}

	// Update password
	const { error: updateError } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (updateError) {
		console.error("Update password error:", updateError.message);

		return {
			isSuccessful: false,
			validationErrorMessage: "Gagal memperbarui password, mohon coba lagi.",
		};
	}

	// Mark the student as having set a custom password
	if (userData?.role === "student") {
		const { error: markPasswordError } = await supabase.rpc(
			"mark_password_changed",
		);

		if (markPasswordError) {
			// The password was already changed successfully.
			// Don't report the whole operation as failed.
			console.error("Mark default password error:", markPasswordError.message);
		}
	}

	return {
		isSuccessful: true,
		validationErrorMessage: null,
	};
};
