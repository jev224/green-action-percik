import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { getCurrentMonthDateRange, sumReduceFn } from "@/utils";

export async function fetchStudentStatistics(userId: string) {
	const { start, end } = getCurrentMonthDateRange();

	const [wasteBankRes, gardenActivityRes, compostRes] = await Promise.all([
		supabase
			.from("waste_banks")
			.select("weight")
			.eq("student_id", userId)
			.gte("created_at", start)
			.lt("created_at", end),

		supabase
			.from("garden_activities")
			.select("*", { count: "estimated", head: true })
			.eq("student_id", userId)
			.gte("created_at", start)
			.lt("created_at", end),

		supabase
			.from("compost_participants")
			.select("*", { count: "estimated", head: true })
			.eq("student_id", userId)
			.gte("created_at", start)
			.lt("created_at", end),
	]);

	if (wasteBankRes.error || gardenActivityRes.error || compostRes.error) {
		const failedQueries = [
			wasteBankRes.error && "waste bank",
			gardenActivityRes.error && "garden activity",
			compostRes.error && "compost activity",
		]
			.filter(Boolean)
			.join(", ");

		throw new ServerError({
			status: 500,
			message: `Failed to fetch student statistics: ${failedQueries}`,
			ui_message: "Terjadi kesalahan dalam memuat halaman. Coba lagi ya",
		});
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
}

export async function fetchStudentTargets(_userId: string) {
	return {
		wasteWeightTarget: 160,
		compostActivityTarget: 1,
		gardenActivityTarget: 4,
	};
}
