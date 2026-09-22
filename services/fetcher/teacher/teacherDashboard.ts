import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { getCurrentMonthDateRange, sumReduceFn } from "@/utils";

export async function fetchTeacherDashboardStats() {
	const { start, end } = getCurrentMonthDateRange();

	const [studentsRes, wasteBankRes, gardenActivityRes, compostRes] =
		await Promise.all([
			supabase.from("students").select("*", {
				count: "exact",
				head: true,
			}),

			supabase
				.from("waste_banks")
				.select("weight")
				.gte("created_at", start)
				.lt("created_at", end),

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
		studentsRes.error ||
		wasteBankRes.error ||
		gardenActivityRes.error ||
		compostRes.error
	) {
		const failedQueries = [
			studentsRes.error && "Student",
			wasteBankRes.error && "waste bank",
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

	const wasteWeightTotal = wasteBankRes.data.reduce(
		(sum, item) => sumReduceFn(sum, item.weight),
		0,
	);

	return {
		studentCount: studentsRes.count ?? 0,
		studentPoinTotal: 0,
		wasteWeightTotal,
		gardenActivityCount: gardenActivityRes.count ?? 0,
		compostActivityCount: compostRes.count ?? 0,
	};
}
