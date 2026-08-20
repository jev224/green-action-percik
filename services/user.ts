import { supabase } from "@/lib/supabase";

type ChangePasswordResult = {
  isSuccessful: boolean;
  validationErrorMessage: string | null;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmation: string,
): Promise<ChangePasswordResult> => {
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

  if (newPassword !== confirmation) {
    return {
      isSuccessful: false,
      validationErrorMessage: "Konfirmasi password tidak cocok",
    };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    return {
      isSuccessful: false,
      validationErrorMessage: "Gagal mendapatkan data pengguna",
    };
  }

  // Verify old password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
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
    return {
      isSuccessful: false,
      validationErrorMessage: updateError.message,
    };
  }

  return {
    isSuccessful: true,
    validationErrorMessage: null,
  };
};
