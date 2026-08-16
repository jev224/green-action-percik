// components/domain/student/StudentListItem.tsx
//
// Was the renderItem body inside lists/StudentList.tsx. Pulled out into
// its own component and, critically, stripped of the store update +
// navigation call that used to live INSIDE the row's onPress. That meant
// the old StudentList could only ever be used on the one screen that
// wanted that exact "save to store, then go to /manages/student" flow —
// it wasn't reusable, it was a screen fragment pretending to be a
// component.
//
// Now it just takes `onPress`. The screen decides what pressing a student
// row actually does (open detail, select for bulk-action, whatever) —
// that's the screen's job, not this row's.

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import type { StudentData } from "./types";

interface StudentListItemProps {
  student: StudentData;
  onPress?: (student: StudentData) => void;
}

export function StudentListItem({ student, onPress }: StudentListItemProps) {
  const { name, grade, point, avatarUrl } = student;

  const content = (
    <Box className="flex-row items-center gap-4 mb-6">
      <UserAvatar
        name={name}
        size="sm"
        imageSource={avatarUrl ? { uri: avatarUrl } : undefined}
      />

      <Box>
        <Heading>{name}</Heading>
        {grade && <Text>{grade}</Text>}
      </Box>

      <Box className="flex-1" />

      {point != null && (
        <Heading className="text-primary font-semibold" size="lg">
          {point} Poin
        </Heading>
      )}
    </Box>
  );

  if (!onPress) return content;

  return <Pressable onPress={() => onPress(student)}>{content}</Pressable>;
}
