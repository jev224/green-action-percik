import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { getCurrentMonthDateRange } from "@/utils";

export async function fetchTeacherDashboardStats() {
	const { start, end } = getCurrentMonthDateRange();

	const [
		studentPointsRes,
		studentsRes,
		wasteWeightRes,
		gardenActivityRes,
		compostRes,
	] = await Promise.all([
		supabase.rpc("get_total_student_points"),

		supabase.from("students").select("*", {
			count: "exact",
			head: true,
		}),

		supabase.rpc("get_monthly_waste_weight", { p_start: start, p_end: end }),

		supabase
			.from("garden_activities")
			.select("*", { count: "estimated", head: true })
			.gte("created_at", start)
			.lt("created_at", end),

		supabase
			.from("compost_participants")
			.select("*", { count: "estimated", head: true })
			.gte("created_at", start)
			.lt("created_at", end),
	]);

	if (
		studentPointsRes.error ||
		studentsRes.error ||
		wasteWeightRes.error ||
		gardenActivityRes.error ||
		compostRes.error
	) {
		const failedQueries = [
			studentPointsRes.error && "Student points",
			studentsRes.error && "Student",
			wasteWeightRes.error && "waste bank weight",
			gardenActivityRes.error && "garden activity",
			compostRes.error && "compost activity",
		]
			.filter(Boolean)
			.join(", ");

		throw new ServerError({
			status: 500,
			message: `Failed to fetch teacher dashboard data: ${failedQueries}`,
			ui_message: "Terjadi kesalahan dalam memuat halaman. Coba lagi ya",
		});
	}

	return {
		studentCount: studentsRes.count ?? 0,
		studentPoinTotal: studentPointsRes.data ?? 0,
		wasteWeightTotal: wasteWeightRes.data ?? 0,
		gardenActivityCount: gardenActivityRes.count ?? 0,
		compostActivityCount: compostRes.count ?? 0,
	};
}
