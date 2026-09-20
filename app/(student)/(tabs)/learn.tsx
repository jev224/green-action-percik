import { LeafyGreen } from "lucide-react-native";
import { memo, useCallback } from "react";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
	contentEnterTransition,
	contentExitTransition,
	contentLayoutTransition,
} from "@/components/animation/presets";
import { GlowDecoration } from "@/components/decoration";

import {
	ActionTile,
	EmptyState,
	Screen,
	ScreenHeader,
	SearchField,
	SortSelect,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import type { ThemeColors } from "@/constants/Colors";
import { useLessons } from "@/hooks/useLessons";

import { useNavigation } from "@/hooks/useNavigation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useLessonStore } from "@/stores/lessonAction";

export default function LearningScreen() {
	const { navigateTo } = useNavigation();

	const viewLesson = useLessonStore((state) => state.viewLesson);

	const {
		searchQuery,
		setSearchQuery,
		sortOptions,
		sort,
		setSort,
		isLoading,
		isError,
		errorMessage,
		results,
		refresh,
		isRefreshing,
		sortDefaultDirection,
		sortDefaultField,
	} = useLessons();

	const handleView = useCallback(
		(id: number) => {
			viewLesson(id);
			navigateTo("/learn/overview");
		},
		[viewLesson, navigateTo],
	);

	const { colors } = useThemeColors();

	const renderItem = useCallback(
		({ item }: { item: (typeof results)[number] }) => (
			<LessonListItem item={item} onPress={handleView} colors={colors} />
		),
		[handleView, colors],
	);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			isRefreshing={isRefreshing}
			errorMessage={errorMessage}
			relativeErrorPos
			onTryAgain={refresh}
			onRefresh={refresh}
			requiredInternet
			headerComponent={
				<>
					<ScreenHeader title="Belajar" />

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
	colors,
}: {
	item: ReturnType<typeof useLessons>["results"][number];
	onPress: (id: number) => void;
	colors: ThemeColors;
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
				contentPosition="top"
				imageSource={item.photoUrl ? { uri: item.photoUrl } : undefined}
				innerDecoration={
					<GlowDecoration
						variant="edges"
						edgeColors={[colors.primary, colors.accent]}
					/>
				}
				icon={!item.photoUrl ? LeafyGreen : undefined}
			/>
		</Animated.View>
	);
});
