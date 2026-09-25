import Animated from "react-native-reanimated";
import {
	contentEnterTransition,
	contentExitTransition,
	contentLayoutTransition,
} from "@/components/animation/presets";
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
			style={{ overflow: "visible" }}
			removeClippedSubviews={false}
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
