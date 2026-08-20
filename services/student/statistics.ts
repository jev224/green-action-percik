import { supabase } from "@/lib/supabase";
import { getCurrentMonthDateRange, sumReduceFn } from "@/utils";
import { getMyId } from "../auth";

export const getHomeStatistics = async () => {
  const user_id = await getMyId();

  if (!user_id) {
    throw new Error("Invalid credentials");
  }

  return getStudentStatistics(user_id);
};

export const getStudentStatistics = async (user_id: string) => {
  const { start, end } = getCurrentMonthDateRange();

  const { error: wasteBankError, data: wasteBankData } = await supabase
    .from("waste_banks")
    .select("weight")
    .eq("student_id", user_id)
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
      .eq("student_id", user_id)
      .gte("created_at", start)
      .lt("created_at", end);

  if (gardenActivityError) {
    throw gardenActivityError;
  }

  const { error: compostError, count: compostActivityCount } = await supabase
    .from("compost_participants")
    .select("*", { count: "estimated", head: true })
    .eq("student_id", user_id)
    .gte("created_at", start)
    .lt("created_at", end);

  if (compostError) {
    throw compostError;
  }

  return {
    studentPoints: 0,
    wasteWeightTotal,
    gardenActivityCount: gardenActivityCount ?? 0,
    compostActivityCount: compostActivityCount ?? 0,
  };
};
