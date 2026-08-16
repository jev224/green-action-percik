// components/domain/student/types.ts
// Was exported inline from lists/StudentList.tsx. Pulled into its own
// file since both StudentList and StudentListItem need it, and
// hooks/useStudents.ts imports it too.

export interface StudentData {
  id: string;
  name: string;
  grade?: string;
  point?: number;
  avatarUrl?: string;
}
