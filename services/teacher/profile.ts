import { supabase } from "@/lib/supabase";

export const getTeacherProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.app_metadata.user_role !== "teacher") {
    throw new Error("Invalid role");
  }

  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getTeacherName = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { data, error } = await supabase
    .from("teachers")
    .select("name")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data.name;
};
