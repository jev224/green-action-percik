import { create } from "zustand";

export interface StudentData {
  id: string;
  name: string;
  grade?: string;
  point?: number;
  avatarUrl?: string;
}

interface StudentStore {
  student: StudentData | null;
  setStudent: (student: StudentData) => void;
  updateStudent: (data: Partial<StudentData>) => void;
  clearStudent: () => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  student: { name: "Unknown", id: "-1" },

  setStudent: (student) => set({ student }),

  updateStudent: (data) =>
    set((state) => ({
      student: state.student ? { ...state.student, ...data } : null,
    })),

  clearStudent: () => set({ student: null }),
}));
