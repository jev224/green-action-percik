import { supabase } from "@/lib/supabase";
import { getMyId, getRole } from "@/services/auth";

export const getStudentProfile = async () => {
	const [user_id, role] = await Promise.all([getMyId(), getRole()]);

	if (!user_id) {
		throw new Error("Invalid credentials");
	}

	if (role !== "student") {
		throw new Error("Invalid role");
	}

	const { data, error } = await supabase
		.from("students")
		.select("*, class:classes(id, grade, major, sub_major)")
		.eq("user_id", user_id)
		.single();

	if (error) {
		throw error;
	}

	return data;
};
