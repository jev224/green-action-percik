import { supabase } from "@/lib/supabase";

export const getStudentProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.app_metadata.user_role !== "student") {
    throw new Error("Invalid role");
  }

  const { data, error } = await supabase
    .from("students")
    .select("*, class:classes(id, grade, major, sub_major)")
    .eq("user_id", user.id)
    .single();

  console.log(data?.class);
  if (error) {
    throw error;
  }

  return data;
};
