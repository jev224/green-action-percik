// components/domain/student/StudentList.tsx
// Was lists/StudentList.tsx. Now a thin FlatList wrapper around
// StudentListItem — no useStudentStore, no useNavigation. The screen
// using this decides what onPress does. See the example screen for how
// the old "save to store, navigate to detail" behavior is now the
// screen's responsibility instead of the list's.

import { FlatList } from "@/components/ui/flat-list";
import { StudentListItem } from "./StudentListItem";
import type { StudentData } from "./types";

interface StudentListProps {
  data: StudentData[];
  onPressStudent?: (student: StudentData) => void;
}

export function StudentList({ data, onPressStudent }: StudentListProps) {
  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      className="overflow-visible"
      renderItem={({ item }) => (
        <StudentListItem student={item} onPress={onPressStudent} />
      )}
      keyExtractor={(student) => student.id}
    />
  );
}
