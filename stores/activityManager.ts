import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "expo-zustand-persist";
import { create } from "zustand";
import type { ActivityCardData } from "@/app/(teacher)/activity-manager/activity-list";
import type {
	fetchAllUnpaidStudentsWaste,
	fetchCompostActivities,
	fetchWasteBanks,
} from "@/services/fetcher/activity/teacherActivityManager";

export type ActivityType = ActivityCardData["type"];

type TypeFromFunction<T extends () => Promise<object[]>> = Awaited<
	ReturnType<T>
>[number];

export type StudentData = TypeFromFunction<typeof fetchAllUnpaidStudentsWaste>;
export type CompostData = TypeFromFunction<typeof fetchCompostActivities>;
export type WasteBankData = TypeFromFunction<typeof fetchWasteBanks>;
export type FilterSection = "incompleted" | "completed";

type ActivityManagerState = {
	activityType: ActivityType | null;
	selectedClass: CompostData | null;
	selectedStudent: StudentData | null;
	selectedWaste: WasteBankData | null;
	sourceSection: FilterSection;

	setActivityType: (type: ActivityType) => void;
	setSelectedClass: (data: CompostData) => void;
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
