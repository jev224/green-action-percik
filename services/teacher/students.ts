import { supabase } from "@/lib/supabase";
import { getCurrentMonthDateRange, sumReduceFn } from "@/utils";
import { getPhotoUrl } from "../photoStorage";

export const getAllStudentStats = async () => {
	const { start, end } = getCurrentMonthDateRange();

	const { error: studentCountError, count: studentCount } = await supabase
		.from("students")
		.select("*", { count: "exact", head: true });

	if (studentCountError) {
		throw studentCountError;
	}

	const { error: wasteBankError, data: wasteBankData } = await supabase
		.from("waste_banks")
		.select("weight")
		.gte("created_at", start)
		.lt("created_at", end);

	if (wasteBankError) {
		throw wasteBankError;
	}

	const wasteWeightTotal = wasteBankData.reduce(
		(sum, item) => sumReduceFn(sum, item.weight),
		0,
	);

	const { error: gardenActivityError, count: gardenActivityCount } =
		await supabase
			.from("garden_activities")
			.select("*", { count: "estimated", head: true })
			.gte("created_at", start)
			.lt("created_at", end);

	if (gardenActivityError) {
		throw gardenActivityError;
	}

	const { error: compostActivityError, count: compostActivityCount } =
		await supabase
			.from("compost_activities")
			.select("*", { count: "estimated", head: true })
			.gte("created_at", start)
			.lt("created_at", end);

	if (compostActivityError) {
		throw compostActivityError;
	}

	return {
		studentCount: studentCount ?? 0,
		studentPoinTotal: 0,
		wasteWeightTotal,
		gardenActivityCount: gardenActivityCount ?? 0,
		compostActivityCount: compostActivityCount ?? 0,
	};
};

export const getAllStudents = async () => {
	const { error: studentError, data } = await supabase.from("students").select(`
      *,
      classes (
        grade,
        major,
        sub_major
      )
    `);

	if (studentError) {
		throw studentError;
	}

	return data.map((student) => ({
		...student,
		photo_url: student.photo && getPhotoUrl("profile-photos", student.photo),
	}));
};

export const getStudentDetails = async (user_id: string) => {
	const { data, error } = await supabase
		.from("students")
		.select("*, class:classes(id, grade, major, sub_major)")
		.eq("user_id", user_id)
		.single();

	console.log(data?.class);
	if (error) {
		throw error;
	}

	return data;
};
