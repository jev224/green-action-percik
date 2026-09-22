import { BookImage, Plus } from "lucide-react-native";
import { memo, useCallback } from "react";
import { FlatList, ScrollView } from "react-native";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	contentEnterTransition,
	contentExitTransition,
	contentLayoutTransition,
} from "@/components/animation/presets";
import {
	ActionTile,
	Button,
	EmptyState,
	Screen,
	ScreenHeader,
	SearchField,
	SortSelect,
} from "@/components/primitives";
import { Fab } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useLessons } from "@/hooks/useLessons";
import { useNavigation } from "@/hooks/useNavigation";
import { useLessonStore } from "@/stores/lesson";

export default function LessonsScreen() {
	const insets = useSafeAreaInsets();

	const { navigateTo } = useNavigation();
	const createLesson = useLessonStore((state) => state.createLesson);
	const editLesson = useLessonStore((state) => state.editLesson);

	const {
		searchQuery,
		setSearchQuery,
		sortOptions,
		sort,
		setSort,
		isLoading,
		isError,
		results,
		refresh,
		isRefreshing,
		errorMessage,
		sortDefaultField,
		sortDefaultDirection,
	} = useLessons();

	const handleEdit = useCallback(
		(id: number) => {
			editLesson(id);
			navigateTo("/lesson/manage-lesson");
		},
		[editLesson, navigateTo],
	);

	const handleCreate = () => {
		createLesson();
		navigateTo("/lesson/manage-lesson");
	};

	const renderItem = useCallback(
		({ item }: { item: (typeof results)[number] }) => (
			<LessonListItem item={item} onPress={handleEdit} />
		),
		[handleEdit],
	);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			relativeErrorPos
			onRefresh={refresh}
			isRefreshing={isRefreshing}
			errorMessage={errorMessage}
			onTryAgain={refresh}
			requiredInternet
			headerComponent={
				<>
					<ScreenHeader title="Kelola Materi" />

					<HStack space="sm">
						<SearchField value={searchQuery} onChangeText={setSearchQuery} />
						<SortSelect
							options={sortOptions}
							value={sort}
							onChange={setSort}
							defaultField={sortDefaultField}
							defaultDirection={sortDefaultDirection}
						/>
					</HStack>
				</>
			}
			contentComponent={
				results.length > 0 ? (
					<FlatList
						data={results}
						showsVerticalScrollIndicator={false}
						className="overflow-visible"
						renderItem={renderItem}
						keyExtractor={(lesson) => String(lesson.id)}
					/>
				) : (
					<EmptyState message="Tidak ada materi pembalajaran." />
				)
			}
			overlayComponent={
				<Fab
					className="p-0 background-transparent"
					style={{ marginBottom: insets.bottom }}
					size="sm"
					placement="bottom right"
				>
					<Button
						label="Materi Baru"
						icon={Plus}
						className="px-5 py-4 gap-0 rounded-full"
						onPress={handleCreate}
					/>
				</Fab>
			}
			loadingComponent={
				<ScrollView
					showsVerticalScrollIndicator={false}
					className="overflow-visible"
				>
					<VStack space="md">
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
					</VStack>
				</ScrollView>
			}
		/>
	);
}

const LessonListItem = memo(function LessonListItem({
	item,
	onPress,
}: {
	item: ReturnType<typeof useLessons>["results"][number];
	onPress: (id: number) => void;
}) {
	const handlePress = useCallback(() => onPress(item.id), [onPress, item.id]);

	return (
		<Animated.View
			layout={contentLayoutTransition}
			entering={contentEnterTransition}
			exiting={contentExitTransition}
		>
			<ActionTile
				onPress={handlePress}
				className="mb-4"
				size="md"
				variant="solid"
				title={item.title}
				description={item.description}
				imageSource={item.photoUrl ? { uri: item.photoUrl } : undefined}
				icon={!item.photoUrl ? BookImage : undefined}
			/>
		</Animated.View>
	);
});
