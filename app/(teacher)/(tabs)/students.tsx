import { useCallback } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

import { StudentData, StudentList } from "@/components/domain";

import {
  EmptyState,
  FilterChips,
  Screen,
  ScreenHeader,
  SearchField,
  SortSelect,
} from "@/components/primitives";

import { useStudentActionStore } from "@/stores/studentOverview";

import { useNavigation } from "@/hooks/useNavigation";
import { useStudents } from "@/hooks/useStudents";

export default function StudentsScreen() {
  const viewStudent = useStudentActionStore((state) => state.viewStudent);
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
    refresh,
    isRefreshing,
  } = useStudents();

  const handlePressStudent = useCallback(
    (student: StudentData) => {
      viewStudent(student.user_id);
      navigateTo("/(teacher)/student/overview");
    },
    [viewStudent, navigateTo],
  );

  return (
    <Screen
      isLoading={isLoading}
      isError={isError}
      onRefresh={refresh}
      isRefreshing={isRefreshing}
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
          <StudentList data={results} onPressStudent={handlePressStudent} />
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
