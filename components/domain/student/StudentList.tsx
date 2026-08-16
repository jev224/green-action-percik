import { FlashList } from "@shopify/flash-list";

import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

import { StudentListItem } from "./StudentListItem";
import type { StudentData } from "./types";
import { FlatList } from "@/components/ui/flat-list";

interface StudentListProps {
  data: StudentData[];
  onPressStudent?: (student: StudentData) => void;
}

const LIST_LAYOUT = LinearTransition.springify()
  .damping(25)
  .stiffness(280)
  .mass(0.8);

const ITEM_ENTER = FadeInDown.easing(Easing.out(Easing.ease))
  .duration(260)
  .delay(100);

const ITEM_EXIT = FadeOutUp.easing(Easing.in(Easing.ease)).duration(220);

export function StudentList({ data, onPressStudent }: StudentListProps) {
  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      className="overflow-visible"
      renderItem={({ item }) => (
        <Animated.View
          layout={LIST_LAYOUT}
          entering={ITEM_ENTER}
          exiting={ITEM_EXIT}
        >
          <StudentListItem student={item} onPress={onPressStudent} />
        </Animated.View>
      )}
      keyExtractor={(student) => student.id}
    />
  );
}
