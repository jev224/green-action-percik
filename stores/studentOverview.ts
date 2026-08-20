import { create } from "zustand";

type StudentActionData = { mode: "view"; userId: string };

interface StudentActionStore {
  studentData: StudentActionData | null;
  viewStudent: (userId: string) => void;
}

export const useStudentActionStore = create<StudentActionStore>((set) => ({
  studentData: null,
  viewStudent: (userId) => set({ studentData: { mode: "view", userId } }),
}));
