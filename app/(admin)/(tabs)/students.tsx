import { useStudents } from "@/hooks/useStudents";

import { HStack } from "@/components/ui/hstack";

import { StudentList } from "@/components/domain";
import {
  FilterChips,
  Screen,
  ScreenHeader,
  SearchField,
  SortSelect,
} from "@/components/primitives";
import { useNavigation } from "@/hooks/useNavigation";

export default function StudentsScreen() {
  const { navigateTo } = useNavigation();
  const {
    searchQuery,
    setSearchQuery,
    filterOptions,
    filter,
    setFilter,
    sortOptions,
    sort,
    setSort,
    results,
  } = useStudents();

  return (
    <Screen
      headerComponent={
        <>
          <ScreenHeader title="Kelola Siswa" />

          <HStack space="sm">
            <SearchField value={searchQuery} onChangeText={setSearchQuery} />
            <SortSelect options={sortOptions} value={sort} onChange={setSort} />
          </HStack>

          <FilterChips
            options={filterOptions}
            selected={filter}
            onSelect={setFilter}
          />
        </>
      }
      contentComponent={
        <StudentList
          data={results}
          onPressStudent={(student) => {
            navigateTo("/(admin)/student/overview");
          }}
        />
      }
    />
  );
}
