// hooks/useStudents.ts

import { useMemo, useState } from "react";
import type { StudentData } from "@/components/domain";
import type {
	SortFieldOption,
	SortState,
} from "@/components/primitives/Input/SortSelect";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { fetchAllStudents } from "@/services/fetcher/teacher/studentManager";

export type StudentSortField = "name" | "grade" | "point";

export const STUDENT_SORT_OPTIONS: SortFieldOption<StudentSortField>[] = [
	{
		field: "name",
		label: "Nama",
		ascLabel: "Nama A-Z",
		descLabel: "Nama Z-A",
	},
	{
		field: "grade",
		label: "Kelas",
		ascLabel: "Kelas A-Z",
		descLabel: "Kelas Z-A",
	},
	{
		field: "point",
		label: "Poin",
		ascLabel: "Poin Terendah",
		descLabel: "Poin Tertinggi",
	},
];

// ---- dummy/mock data ----
const MOCK_STUDENTS_RAW: Awaited<ReturnType<typeof fetchAllStudents>> = [
	{
		id: 1,
		user_id: "u1",
		name: "Andi Saputra",
		photoUrl: undefined,
		created_at: "2024-01-10T00:00:00.000Z",
		class_id: 101,
		username: "andi.saputra",
		nis: 2024001,
		class: { grade: "7", major: "IPA", sub_major: "A" },
	},
	{
		id: 2,
		user_id: "u2",
		name: "Budi Santoso",
		photoUrl: undefined,
		created_at: "2024-01-10T00:00:00.000Z",
		class_id: 101,
		username: "budi.santoso",
		nis: 2024002,
		class: { grade: "7", major: "IPA", sub_major: "A" },
	},
	{
		id: 3,
		user_id: "u3",
		name: "Citra Dewi",
		photoUrl: undefined,
		created_at: "2024-01-11T00:00:00.000Z",
		class_id: 102,
		username: "citra.dewi",
		nis: 2024003,
		class: { grade: "8", major: "IPS", sub_major: "B" },
	},
	{
		id: 4,
		user_id: "u4",
		name: "Dian Permata",
		photoUrl: undefined,
		created_at: "2024-01-12T00:00:00.000Z",
		class_id: 103,
		username: "dian.permata",
		nis: 2024004,
		class: { grade: "9", major: "IPA", sub_major: "C" },
	},
	{
		id: 5,
		user_id: "u5",
		name: "Eka Wijaya",
		photoUrl: undefined,
		created_at: "2024-01-12T00:00:00.000Z",
		class_id: 102,
		username: "eka.wijaya",
		nis: 2024005,
		class: { grade: "8", major: "IPS", sub_major: "B" },
	},
];

async function getMockStudents() {
	// simulate network latency
	await new Promise((res) => setTimeout(res, 300));
	return MOCK_STUDENTS_RAW;
}

export interface UseStudentsOptions {
	dummy?: boolean;
}

export function useStudents(options?: UseStudentsOptions) {
	const { dummy = false } = options ?? {};

	const fetcher = dummy ? getMockStudents : fetchAllStudents;

	const {
		data: rawStudents,
		isLoading,
		isError,
		isRefreshing,
		errorMessage,
		refresh,
	} = useAsyncData(fetcher, undefined, [dummy]);

	const students: StudentData[] = useMemo(
		() =>
			(rawStudents ?? []).map((s) => ({
				id: s.id,
				user_id: s.user_id,
				name: s.name,
				photoUrl: s.photoUrl,
				grade: `Kelas ${s.class.grade}`,
				point: 0,
			})),
		[rawStudents],
	);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
	const [sort, setSort] = useState<SortState<StudentSortField> | null>(null);

	const grades = useMemo(
		() =>
			Array.from(new Set(students.map((s) => s.grade).filter(Boolean))).sort(),
		[students],
	);

	const gradeFiltered = useMemo(() => {
		if (!selectedGrade) return students;
		return students.filter((s) => s.grade === selectedGrade);
	}, [students, selectedGrade]);

	const searched = useFuzzySearch(gradeFiltered, ["name"], searchQuery);

	const results = useMemo(() => {
		if (!sort) return searched;
		const { field, direction } = sort;

		const sorted = [...searched].sort((a, b) => {
			if (field === "point") return (a.point || 0) - (b.point || 0);
			const aVal = field === "name" ? a.name : a.grade;
			const bVal = field === "name" ? b.name : b.grade;
			return aVal.localeCompare(bVal);
		});

		return direction === "asc" ? sorted : sorted.reverse();
	}, [searched, sort]);

	const unfilteredResults = students;

	return {
		isLoading,
		isError,

		searchQuery,
		setSearchQuery,

		filterOptions: grades,
		filter: selectedGrade,
		setFilter: setSelectedGrade,

		sortOptions: STUDENT_SORT_OPTIONS,
		sort,
		setSort,

		results,
		unfilteredResults,

		isRefreshing,
		refresh,

		errorMessage,
	};
}
