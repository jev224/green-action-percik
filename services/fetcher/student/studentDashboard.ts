import { supabase } from "@/lib/supabase";
import { ServerError } from "@/services/ServerError";
import { getCurrentMonthDateRange } from "@/utils";

const DEFAULT_TARGETS = {
	wasteWeightTarget: 160,
	compostActivityTarget: 1,
	gardenActivityTarget: 4,
} as const;

export async function fetchStudentStatistics(userId: string) {
	const { start, end } = getCurrentMonthDateRange();

	const [
		studentPointRes,
		claimablePriceRes,
		wasteWeightRes,
		gardenActivityRes,
		compostRes,
	] = await Promise.all([
		supabase.from("students").select("points").eq("user_id", userId).single(),

		supabase.rpc("get_unpaid_student_waste_total", {
			p_student_id: userId,
		}),

		supabase.rpc("get_monthly_waste_weight", {
			p_start: start,
			p_end: end,
			p_student_id: userId,
		}),

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

	if (
		studentPointRes.error ||
		claimablePriceRes.error ||
		wasteWeightRes.error ||
		gardenActivityRes.error ||
		compostRes.error
	) {
		const failedQueries = [
			studentPointRes.error && "Student data",
			claimablePriceRes.error && "Claimable waste price",
			wasteWeightRes.error && "waste bank",
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

	return {
		studentPoints: studentPointRes.data.points,
		claimablePrice: claimablePriceRes.data ?? 0,
		wasteWeightTotal: wasteWeightRes.data ?? 0,
		gardenActivityCount: gardenActivityRes.count ?? 0,
		compostActivityCount: compostRes.count ?? 0,
	};
}

export async function fetchStudentTargets(userId: string) {
	const [studentRes, globalRes] = await Promise.all([
		supabase
			.from("student_targets")
			.select("*")
			.eq("student_id", userId)
			.maybeSingle(),

		supabase.from("all_student_targets").select("*").limit(1).maybeSingle(),
	]);

	if (studentRes.error) {
		console.error(
			`Failed to fetch student targets (student_id: ${userId}): ${studentRes.error.message}`,
		);
	}

	if (globalRes.error) {
		console.error(
			`Failed to fetch all_student_targets: ${globalRes.error.message}`,
		);
	}

	const student = studentRes.data;
	const global = globalRes.data;

	// Priority per field: student override -> global target -> hardcoded default
	return {
		wasteWeightTarget:
			student?.waste_weight ??
			global?.waste_weight ??
			DEFAULT_TARGETS.wasteWeightTarget,
		compostActivityTarget:
			student?.compost_activity ??
			global?.compost_activity ??
			DEFAULT_TARGETS.compostActivityTarget,
		gardenActivityTarget:
			student?.garden_activity ??
			global?.garden_activity ??
			DEFAULT_TARGETS.gardenActivityTarget,
	};
}
