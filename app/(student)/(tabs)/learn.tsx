import { LeafyGreen } from "lucide-react-native";
import { memo, useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
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
	SegmentedControl,
	SortSelect,
} from "@/components/primitives";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import type { ThemeColors } from "@/constants/Colors";
import { type LessonEmptyState, useLessons } from "@/hooks/useLessons";
import { useNavigation } from "@/hooks/useNavigation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserProfile } from "@/hooks/useUser";
import { useLessonStore } from "@/stores/lesson";

const EMPTY_CONTENT: Record<
	LessonEmptyState,
	{ emoji?: string; message: string }
> = {
	"no-lessons": {
		emoji: "📚",
		message: "Belum ada materi pembelajaran.",
	},
	"not-found": {
		message: "Materi pembelajaran tidak ditemukan.",
	},
	"all-completed": {
		emoji: "😎👏",
		message: "Kamu telah menyelesaikan semua materi pembelajaran.",
	},
	"none-completed": {
		emoji: "😕",
		message: "Belum ada materi pembelajaran yang kamu selesaikan.",
	},
};

export default function LearningScreen() {
	const { navigateTo } = useNavigation();
	const { profile } = useUserProfile("student");

	const viewLesson = useLessonStore((state) => state.viewLesson);

	const {
		searchQuery,
		setSearchQuery,
		segmentedControlOptions,
		segmentedControlValue,
		segementedControlSet,
		sortOptions,
		sort,
		setSort,
		isLoading,
		isError,
		errorMessage,
		results,
		emptyState,
		refresh,
		isRefreshing,
		sortDefaultDirection,
		sortDefaultField,
	} = useLessons(profile?.user_id);

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
			errorMessage={errorMessage}
			relativeErrorPos
			onTryAgain={refresh}
			requiredInternet
			tabBarPadding
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

					<SegmentedControl
						onChange={segementedControlSet}
						value={segmentedControlValue}
						options={segmentedControlOptions}
					/>
				</>
			}
			contentComponent={
				results.length > 0 ? (
					<FlatList
						refreshControl={
							<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
						}
						data={results}
						showsVerticalScrollIndicator={false}
						className="overflow-visible"
						renderItem={renderItem}
						keyExtractor={(lesson) => String(lesson.id)}
					/>
				) : emptyState ? (
					<LessonEmpty key={emptyState} type={emptyState} />
				) : null
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

const LessonEmpty = memo(function LessonEmpty({
	type,
}: {
	type: LessonEmptyState;
}) {
	const { emoji, message } = EMPTY_CONTENT[type];

	return (
		<Animated.View
			entering={contentEnterTransition}
			exiting={contentExitTransition}
		>
			{emoji && (
				<Heading size="5xl" className="self-center mt-8 -mb-8 py-1 -z-10">
					{emoji}
				</Heading>
			)}
			<EmptyState message={message} />
		</Animated.View>
	);
});

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
