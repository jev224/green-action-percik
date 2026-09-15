import Animated from "react-native-reanimated";

import { StudentListItem } from "./StudentListItem";
import type { StudentData } from "./types";
import { FlatList } from "@/components/ui/flat-list";
import {
  contentEnterTransition,
  contentExitTransition,
  contentLayoutTransition,
} from "@/components/animation/presets";

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
        <Animated.View
          layout={contentLayoutTransition}
          entering={contentEnterTransition}
          exiting={contentExitTransition}
        >
          <StudentListItem student={item} onPress={onPressStudent} />
        </Animated.View>
      )}
      keyExtractor={(student) => student.user_id}
    />
  );
}
