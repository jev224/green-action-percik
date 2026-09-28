import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "expo-zustand-persist";
import { create } from "zustand";

type StudentActionData = { mode: "view"; userId: string };

interface StudentActionStore {
	studentData: StudentActionData | null;
	viewStudent: (userId: string) => void;
}

export const useStudentActionStore = create<StudentActionStore>(
	persist(
		(set) => ({
			studentData: null,
			viewStudent: (userId) => set({ studentData: { mode: "view", userId } }),
		}),
		{
			name: "use-student-action-store",
			version: 1,
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
