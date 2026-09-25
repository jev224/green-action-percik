import { create } from "zustand";
import type { LessonContent } from "@/lib/supabase/database.types";

type Lesson =
	| { mode: "create" }
	| { mode: "edit"; id: number }
	| { mode: "view"; id: number };

interface LessonContentData {
	id: number;
	title: string;
	contents: LessonContent[];
}

interface LessonStore {
	lesson: Lesson;
	createLesson: () => void;
	editLesson: (id: number) => void;
	viewLesson: (id: number) => void;

	lessonContentData: LessonContentData | null;
	setLessonContentData: (
		id: number,
		title: string,
		contents: LessonContent[],
	) => void;
	clearLessonContentData: () => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
	lesson: { mode: "create" },
	lessonContentData: null,
	setLessonContentData: (id, title, contents) =>
		set({ lessonContentData: { id, title, contents } }),
	clearLessonContentData: () => set({ lessonContentData: null }),

	createLesson: () => set({ lesson: { mode: "create" } }),
	editLesson: (id) => set({ lesson: { mode: "edit", id } }),
	viewLesson: (id) => set({ lesson: { mode: "view", id } }),
}));
