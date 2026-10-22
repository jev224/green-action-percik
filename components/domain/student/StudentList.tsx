import { FlatList, type FlatListProps } from "react-native";
import { StudentListItem } from "./StudentListItem";
import type { StudentData } from "./types";

interface StudentListProps {
	data: StudentData[];
	refreshControl?: FlatListProps<StudentData>["refreshControl"];
	ListEmptyComponent?: FlatListProps<StudentData>["ListEmptyComponent"];
	onPressStudent?: (student: StudentData) => void;
}

export function StudentList({
	data,
	refreshControl,
	ListEmptyComponent,
	onPressStudent,
}: StudentListProps) {
	return (
		<FlatList
			className="native:overflow-visible"
			data={data}
			refreshControl={refreshControl}
			showsVerticalScrollIndicator={false}
			removeClippedSubviews={false}
			renderItem={({ item }) => (
				<StudentListItem student={item} onPress={onPressStudent} />
			)}
			keyExtractor={(student) => student.user_id}
			ListEmptyComponent={ListEmptyComponent}
		/>
	);
}
