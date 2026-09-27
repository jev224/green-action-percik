import { useMemo, useState } from "react";
import type { SegmentedControlOption } from "@/components/primitives";
import type {
	SortFieldOption,
	SortState,
} from "@/components/primitives/Input/SortSelect";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { fetchCompletedLessonsData } from "@/services/fetcher/lesson/completedLesson";
import { fetchAllLessons } from "@/services/fetcher/lesson/lessonQuery";

export interface LessonData {
	id: number;
	title: string;
	description: string;
	photoUrl?: string | null;
	createdAt: Date;
}

export type LessonSortField = "title" | "created";

export const LESSON_SORT_OPTIONS: SortFieldOption<LessonSortField>[] = [
	{
		field: "title",
		label: "Judul",
		ascLabel: "Judul A-Z",
		descLabel: "Judul Z-A",
	},

	{
		field: "created",
		label: "Tanggal dibuat",
		ascLabel: "Terbaru",
		descLabel: "Terlama",
	},
];

type Status = "incompleted" | "completed";

const SEGMENTED_CONTROL_OPTIONS: SegmentedControlOption<Status>[] = [
	{ label: "Belum Selesai", value: "incompleted" },
	{ label: "Selesai", value: "completed" },
] as const;

const fetchLessons = async (): Promise<LessonData[]> =>
	(await fetchAllLessons()).map(
		({ id, title, description, photoUrl, created_at }) => ({
			id,
			title,
			description,
			photoUrl,
			createdAt: new Date(created_at),
		}),
	);

export function useLessons(studentId?: string) {
	const [segmentedControlValue, setSegmentedControlValue] =
		useState<Status>("incompleted");

	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<SortState<LessonSortField> | null>(null);

	const {
		data,
		isLoading,
		isError,
		error,
		errorMessage,
		refresh,
		isRefreshing,
	} = useAsyncData(async () => ({
		lessons: await fetchLessons(),
		completed: studentId
			? new Set<number>(
					(await fetchCompletedLessonsData(studentId)).map(
						({ lesson_id }) => lesson_id,
					),
				)
			: new Set<number>(),
	}));

	const searched = useFuzzySearch(
		data?.lessons ?? [],
		["title", "description"],
		searchQuery,
	);

	const results = useMemo(() => {
		const completed = data?.completed;

		// 1. filter by completion status
		let filtered = searched;

		if (studentId && completed) {
			if (segmentedControlValue === "completed") {
				filtered = searched.filter(({ id }) => completed.has(id));
			}

			if (segmentedControlValue === "incompleted") {
				filtered = searched.filter(({ id }) => !completed.has(id));
			}
		}

		if (!sort) return filtered;

		let sorted = [];

		switch (sort.field) {
			case "title":
				sorted = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "created":
				sorted = [...filtered].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
				break;
		}

		return sort.direction === "asc" ? sorted : sorted.reverse();
	}, [searched, sort, segmentedControlValue, data?.completed, studentId]);

	return {
		searchQuery,
		setSearchQuery,

		segmentedControlOptions: SEGMENTED_CONTROL_OPTIONS,
		segmentedControlValue: segmentedControlValue,
		segementedControlSet: setSegmentedControlValue,

		sortOptions: LESSON_SORT_OPTIONS,
		sortDefaultField: "created" as const,
		sortDefaultDirection: "asc" as const,
		sort,
		setSort,

		results,

		isLoading,
		isError,
		error,

		refresh,
		isRefreshing,
		errorMessage,
	};
}
