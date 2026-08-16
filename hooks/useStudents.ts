// hooks/useStudents.ts
// Import paths updated: StudentData now lives in
// components/domain/student/types.ts (was lists/StudentList.tsx), and
// SortSelect moved to components/primitives/Input/SortSelect.tsx.

import { useMemo, useState } from "react";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";

import type { StudentData } from "@/components/domain/student/types";
import type {
  SortFieldOption,
  SortState,
} from "@/components/primitives/Input/SortSelect";

export type StudentSortField = "name" | "grade" | "point";

export const STUDENTS: StudentData[] = [
  { id: "1", name: "Andi Pratama", grade: "10A", point: 85 },
  { id: "2", name: "Budi Santoso", grade: "10A", point: 92 },
  { id: "3", name: "Citra Lestari", grade: "10B", point: 78 },
  { id: "4", name: "Dimas Saputra", grade: "10B", point: 88 },
  { id: "5", name: "Eka Putri", grade: "10C", point: 95 },
  { id: "6", name: "Fajar Ramadhan", grade: "10C", point: 81 },
  { id: "7", name: "Gina Amelia", grade: "10A", point: 90 },
  { id: "8", name: "Hendra Wijaya", grade: "10B", point: 76 },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState<StudentSortField> | null>(null);

  const grades = useMemo(
    () =>
      Array.from(
        new Set(STUDENTS.map((s) => s.grade).filter(Boolean)),
      ).sort() as string[],
    [],
  );

  const gradeFiltered = useMemo(() => {
    if (!selectedGrade) return STUDENTS;
    return STUDENTS.filter((s) => s.grade === selectedGrade);
  }, [selectedGrade]);

  const searched = useFuzzySearch(gradeFiltered, ["name"], searchQuery);

  const results = useMemo(() => {
    if (!sort) return searched;
    const { field, direction } = sort;
    const sorted = [...searched].sort((a, b) => {
      if (field === "point") return (a.point ?? 0) - (b.point ?? 0);
      const aVal = (field === "name" ? a.name : a.grade) ?? "";
      const bVal = (field === "name" ? b.name : b.grade) ?? "";
      return aVal.localeCompare(bVal);
    });
    return direction === "asc" ? sorted : sorted.reverse();
  }, [searched, sort]);

  return {
    searchQuery,
    setSearchQuery,

    filterOptions: grades,
    filter: selectedGrade,
    setFilter: setSelectedGrade,

    sortOptions: STUDENT_SORT_OPTIONS,
    sort,
    setSort,

    results,
  };
}
