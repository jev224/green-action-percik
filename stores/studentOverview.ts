import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "expo-zustand-persist";
import { create } from "zustand";
import type { fetchStudentProfile } from "@/services/fetcher/student/studentQuery";

// biome-ignore lint/suspicious/noExplicitAny: Allow any funtion arguments for this type
type TypeFromFunction<T extends (...args: any) => Promise<object>> = Awaited<
	ReturnType<T>
>;

export type StudentProfile = TypeFromFunction<typeof fetchStudentProfile>;

type StudentActionData = { mode: "view"; userId: string };

interface StudentActionStore {
	studentData: StudentActionData | null;
	viewStudent: (userId: string) => void;

	studentProfile: StudentProfile | null;
	setStudentProfile: (profile: StudentProfile) => void;
}

export const useStudentActionStore = create<StudentActionStore>(
	persist(
		(set) => ({
			studentData: null,
			viewStudent: (userId) => set({ studentData: { mode: "view", userId } }),
			studentProfile: null,
			setStudentProfile: (profile) => set({ studentProfile: profile }),
		}),
		{
			name: "use-student-action-store",
			version: 1,
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
