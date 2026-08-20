import { useStudents } from "@/hooks/useStudents";

import { HStack } from "@/components/ui/hstack";

import { StudentList } from "@/components/domain";
import {
  EmptyState,
  FilterChips,
  Screen,
  ScreenHeader,
  SearchField,
  SortSelect,
} from "@/components/primitives";
import { useNavigation } from "@/hooks/useNavigation";
import { ScrollView } from "react-native-gesture-handler";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useStudentActionStore } from "@/stores/studentOverview";

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
    isError,
    isLoading,
  } = useStudents();

  const viewStudent = useStudentActionStore((state) => state.viewStudent);

  return (
    <Screen
      isLoading={isLoading}
      isError={isError}
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
        results.length > 0 ? (
          <StudentList
            data={results}
            onPressStudent={(student) => {
              viewStudent(student.user_id);
              navigateTo("/(teacher)/student/overview");
            }}
          />
        ) : (
          <EmptyState message="Tidak ada siswa" />
        )
      }
      loadingComponent={
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="overflow-visible"
        >
          <VStack space="md">
            {Array.from({ length: 12 }).map((_, index) => (
              <HStack key={index} space="lg" className="w-full items-center">
                <Skeleton className="h-16 w-16 rounded-full" />

                <VStack space="sm">
                  <SkeletonText className="h-5 w-48" />
                  <SkeletonText className="h-5 w-32" />
                </VStack>
              </HStack>
            ))}
          </VStack>
        </ScrollView>
      }
    />
  );
}
