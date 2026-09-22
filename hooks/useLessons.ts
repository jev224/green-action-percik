import { useMemo, useState } from "react";
import type {
	SortFieldOption,
	SortState,
} from "@/components/primitives/Input/SortSelect";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { fetchAllLessons } from "@/services/fetcher/lesson/lessonQuery";

export interface LessonData {
	id: number;
	title: string;
	description: string;
	photo?: string;
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

const fetchLessons = async (): Promise<LessonData[]> =>
	(await fetchAllLessons()).map(
		({ id, title, description, photo, photoUrl, created_at }) => ({
			id,
			title,
			description,
			photo,
			photoUrl,
			createdAt: new Date(created_at),
		}),
	);

export function useLessons() {
	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<SortState<LessonSortField> | null>(null);

	const {
		data: lessons,
		isLoading,
		isError,
		error,
		errorMessage,
		refresh,
		isRefreshing,
	} = useAsyncData<LessonData[]>(fetchLessons);

	const searched = useFuzzySearch(
		lessons ?? [],
		["title", "description"],
		searchQuery,
	);

	const results = useMemo(() => {
		if (!sort) return searched;

		let sorted = [];

		switch (sort.field) {
			case "title":
				sorted = [...searched].sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "created":
				sorted = [...searched].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
				break;
		}

		return sort.direction === "asc" ? sorted : sorted.reverse();
	}, [searched, sort]);

	return {
		searchQuery,
		setSearchQuery,

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
