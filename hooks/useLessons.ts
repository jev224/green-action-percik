import { useMemo, useState } from "react";
import type {
	SortFieldOption,
	SortState,
} from "@/components/primitives/Input/SortSelect";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { getAllLessons } from "@/services/teacher/lessons";

export interface LessonData {
	id: number;
	title: string;
	description: string;
	photo?: string;
	photoUrl: string | null;
}

export type LessonSortField = "title";

export const LESSON_SORT_OPTIONS: SortFieldOption<LessonSortField>[] = [
	{
		field: "title",
		label: "Judul",
		ascLabel: "Judul A-Z",
		descLabel: "Judul Z-A",
	},
];

// getAllLessons returns numeric ids; normalize to string to match LessonData
const fetchLessons = async (): Promise<LessonData[]> => {
	const lessons = await getAllLessons();
	return lessons;
};

export function useLessons() {
	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<SortState<LessonSortField> | null>(null);

	const {
		data: lessons,
		isLoading,
		isError,
		error,
		refresh,
		isRefreshing,
	} = useAsyncData<LessonData[]>(fetchLessons, []);

	const searched = useFuzzySearch(
		lessons ?? [],
		["title", "description"],
		searchQuery,
	);

	const results = useMemo(() => {
		if (!sort) return searched;

		const sorted = [...searched].sort((a, b) => a.title.localeCompare(b.title));

		return sort.direction === "asc" ? sorted : sorted.reverse();
	}, [searched, sort]);

	return {
		searchQuery,
		setSearchQuery,

		sortOptions: LESSON_SORT_OPTIONS,
		sort,
		setSort,

		results,

		isLoading,
		isError,
		error,

		refresh,
		isRefreshing,
	};
}
