import { useMemo, useState } from "react";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { LucideIcon } from "lucide-react-native";

import { Leaf, Recycle, Sprout, RefreshCw } from "lucide-react-native";

import type {
  SortFieldOption,
  SortState,
} from "@/components/primitives/Input/SortSelect";

export interface LessonData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
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

export const LESSONS: LessonData[] = [
  {
    id: "1",
    title: "Mengenal Sampah Organik",
    description: "Pelajari jenis sampah organik dan cara mengelolanya",
    icon: Leaf,
  },
  {
    id: "2",
    title: "Mengenal Sampah Anorganik",
    description: "Kenali sampah anorganik dan cara memilahnya dengan benar",
    icon: Recycle,
  },
  {
    id: "3",
    title: "Perawatan Taman Sekolah",
    description: "Pelajari cara merawat tanaman dan menjaga kebersihan taman",
    icon: Sprout,
  },
  {
    id: "4",
    title: "Dasar Dasar Kompos",
    description: "Kenali proses pengomposan dan manfaatnya bagi lingkungan",
    icon: RefreshCw,
  },
];

export function useLessons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortState<LessonSortField> | null>(null);

  const searched = useFuzzySearch(
    LESSONS,
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
  };
}
