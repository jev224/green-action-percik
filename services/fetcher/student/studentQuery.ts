import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { withProfilePicture } from "../account/profile";
import type { Database } from "@/lib/supabase/database.types";

type ClassDara = Database["public"]["Tables"]["classes"]["Row"];

type StudentData = Omit<
  Database["public"]["Tables"]["students"]["Row"],
  "user_id"
> & {
  user_id: string;
  photoUrl: string | null;
  class: ClassDara;
};

export const fetchAllStudents = async () => {
  const { error, data } = await supabase
    .from("students")
    .select("*, class:classes(grade, major, sub_major)");

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to fetch all students: ${error.message}`,
      ui_message: "Daftar siswa belum bisa dimuat. Coba lagi ya",
    });
  }

  return Promise.all(
    data.map((student) => withProfilePicture(student, "photo")),
  ) as Promise<StudentData[]>;
};

export const fetchStudentProfile = async (userId: string) => {
  const { error, data } = await supabase
    .from("students")
    .select("*, class:classes(grade, major, sub_major)")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to fetch all students: ${error.message}`,
      ui_message: "Daftar siswa belum bisa dimuat. Coba lagi ya",
    });
  }

  return (await withProfilePicture(data, "photo")) as StudentData;
};

export const fetchStudentsByClass = async (classId: number) => {
  const { error, data } = await supabase
    .from("students")
    .select("*, class:classes(id, grade, major, sub_major)")
    .eq("class_id", classId);

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to fetch students for class ${classId}: ${error.message}`,
      ui_message: "Daftar siswa di kelas ini belum bisa dimuat. Coba lagi ya",
    });
  }

  return Promise.all(
    data.map((student) => withProfilePicture(student, "photo")),
  ) as Promise<StudentData[]>;
};
