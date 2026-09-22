import { create } from "zustand";
import type { Database } from "@/lib/supabase/database.types";

export type ActivityType = "waste-bank" | "compost-activity";
export type ClassData = Database["public"]["Tables"]["classes"]["Row"];
export type WasteBankData = Database["public"]["Tables"]["waste_banks"]["Row"];

type ActivityManagerState = {
	activityType: ActivityType | null;
	selectedClass: ClassData | null;
	selectedWaste: WasteBankData | null;

	setActivityType: (type: ActivityType) => void;
	setSelectedClass: (data: ClassData) => void;
	setSelectedWaste: (data: WasteBankData) => void;
	reset: () => void;
};

const initialState = {
	activityType: null,
	selectedClass: null,
	selectedWaste: null,
} satisfies Pick<
	ActivityManagerState,
	"activityType" | "selectedClass" | "selectedWaste"
>;

export const useActivityManagerStore = create<ActivityManagerState>((set) => ({
	...initialState,
	setActivityType: (type) => set({ activityType: type }),
	setSelectedClass: (data) => set({ selectedClass: data }),
	setSelectedWaste: (data) => set({ selectedWaste: data }),
	reset: () => set(initialState),
}));
