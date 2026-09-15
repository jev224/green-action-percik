import { supabase } from "@/lib/supabase";
import { getCurrentMonthDateRange, sumReduceFn } from "@/utils";
import { getMyId } from "../auth";

export const getStudentStatistics = async () => {
	const user_id = await getMyId();

	if (!user_id) {
		throw new Error("Invalid credentials");
	}

	return getStudentStatisticsById(user_id);
};

export const getStudentTargets = async () => {
	return {
		wasteWeightTarget: 160,
		compostActivityTarget: 1,
		gardenActivityTarget: 4,
	};
};

export const getStudentStatisticsById = async (user_id: string) => {
	const { start, end } = getCurrentMonthDateRange();

	const [wasteBankRes, gardenActivityRes, compostRes] = await Promise.all([
		supabase
			.from("waste_banks")
			.select("weight")
			.eq("student_id", user_id)
			.gte("created_at", start)
			.lt("created_at", end),
		supabase
			.from("garden_activities")
			.select("*", { count: "estimated", head: true })
			.eq("student_id", user_id)
			.gte("created_at", start)
			.lt("created_at", end),
		supabase
			.from("compost_participants")
			.select("*", { count: "estimated", head: true })
			.eq("student_id", user_id)
			.gte("created_at", start)
			.lt("created_at", end),
	]);

	if (wasteBankRes.error) {
		throw wasteBankRes.error;
	}

	if (gardenActivityRes.error) {
		throw gardenActivityRes.error;
	}

	if (compostRes.error) {
		throw compostRes.error;
	}

	const wasteWeightTotal = wasteBankRes.data.reduce(
		(sum, item) => sumReduceFn(sum, item.weight),
		0,
	);

	return {
		studentPoints: 0, // TODO: not wired up yet — reward formula still unresolved
		wasteWeightTotal,
		gardenActivityCount: gardenActivityRes.count ?? 0,
		compostActivityCount: compostRes.count ?? 0,
	};
};
