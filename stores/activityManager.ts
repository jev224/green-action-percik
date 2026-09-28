import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "expo-zustand-persist";
import { create } from "zustand";
import type { Database } from "@/lib/supabase/database.types";

export type ActivityType =
	| "waste-bank"
	| "compost-activity"
	| "debt-settlement";

export type StudentData = Database["public"]["Tables"]["students"]["Row"];
export type ClassData = Database["public"]["Tables"]["classes"]["Row"];
export type WasteBankData = Database["public"]["Tables"]["waste_banks"]["Row"];
export type FilterSection = "incompleted" | "completed";

type ActivityManagerState = {
	activityType: ActivityType | null;
	selectedClass: ClassData | null;
	selectedStudent: StudentData | null;
	selectedWaste: WasteBankData | null;
	sourceSection: FilterSection;

	setActivityType: (type: ActivityType) => void;
	setSelectedClass: (data: ClassData) => void;
	setSelectedStudent: (data: StudentData) => void;
	setSelectedWaste: (data: WasteBankData) => void;
	setSourceSection: (section: FilterSection) => void;

	reset: () => void;
};

const initialState = {
	activityType: null,
	selectedClass: null,
	selectedStudent: null,
	selectedWaste: null,
	sourceSection: "completed",
} satisfies Pick<
	ActivityManagerState,
	| "activityType"
	| "selectedClass"
	| "selectedStudent"
	| "selectedWaste"
	| "sourceSection"
>;

export const useActivityManagerStore = create<ActivityManagerState>()(
	persist(
		(set) => ({
			...initialState,

			setActivityType: (type) => set({ activityType: type }),
			setSelectedClass: (data) => set({ selectedClass: data }),
			setSelectedStudent: (data) => set({ selectedStudent: data }),
			setSelectedWaste: (data) => set({ selectedWaste: data }),
			setSourceSection: (section) => set({ sourceSection: section }),

			reset: () => set(initialState),
		}),
		{
			name: "use-activity-manager-store",
			version: 1,
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
