import { create } from "zustand";
import type { Database } from "@/lib/supabase/database.types";

export type ActivityType = "waste-bank" | "compost-activity";
export type ClassData = Database["public"]["Tables"]["classes"]["Row"];
export type WasteBankData = Database["public"]["Tables"]["waste_banks"]["Row"];
export type FilterSection = "incompleted" | "completed";

type ActivityManagerState = {
	activityType: ActivityType | null;
	selectedClass: ClassData | null;
	selectedWaste: WasteBankData | null;
	sourceSection: FilterSection;

	setActivityType: (type: ActivityType) => void;
	setSelectedClass: (data: ClassData) => void;
	setSelectedWaste: (data: WasteBankData) => void;
	setSourceSection: (section: FilterSection) => void;

	reset: () => void;
};

const initialState = {
	activityType: null,
	selectedClass: null,
	selectedWaste: null,
	sourceSection: "completed",
} satisfies Pick<
	ActivityManagerState,
	"activityType" | "selectedClass" | "selectedWaste" | "sourceSection"
>;

export const useActivityManagerStore = create<ActivityManagerState>((set) => ({
	...initialState,

	setActivityType: (type) => set({ activityType: type }),
	setSelectedClass: (data) => set({ selectedClass: data }),
	setSelectedWaste: (data) => set({ selectedWaste: data }),
	setSourceSection: (section) => set({ sourceSection: section }),

	reset: () => set(initialState),
}));
