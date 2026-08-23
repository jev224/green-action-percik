// hooks/useStudents.ts

import { useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";

import type {
  SortFieldOption,
  SortState,
} from "@/components/primitives/Input/SortSelect";
import { getAllStudents } from "@/services/teacher/students";
import { StudentData } from "@/components/domain";

export type StudentSortField = "name" | "grade" | "point";

export const STUDENT_SORT_OPTIONS: SortFieldOption<StudentSortField>[] = [
  { field: "name", label: "Nama", ascLabel: "Nama A-Z", descLabel: "Nama Z-A" },
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

export function useStudents() {
  const {
    data: rawStudents,
    isLoading,
    isError,
    isRefreshing,
    refresh,
  } = useAsyncData(getAllStudents, []);

  const students: StudentData[] = useMemo(
    () =>
      (rawStudents ?? []).map((s) => ({
        id: s.id,
        user_id: s.user_id,
        name: s.name,
        photo_url: s.photo_url,
        grade: `Kelas ${s.classes.grade}`,
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
      if (field === "point") return a.point - b.point;
      const aVal = field === "name" ? a.name : a.grade;
      const bVal = field === "name" ? b.name : b.grade;
      return aVal.localeCompare(bVal);
    });

    return direction === "asc" ? sorted : sorted.reverse();
  }, [searched, sort]);

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

    isRefreshing,
    refresh,
  };
}
