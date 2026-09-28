import { Redirect } from "expo-router";
import { BookCheck } from "lucide-react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import Animated, {
	interpolate,
	type SharedValue,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSequence,
	withSpring,
} from "react-native-reanimated";
import {
	Carousel,
	type CarouselItemAnimation,
	type CarouselRef,
} from "react-native-reanimated-carousel";
import { AnimationConfig } from "@/components/animation/presets";
import { BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ProgressBar,
	Screen,
	ScreenHeader,
	SurfaceCard,
} from "@/components/primitives";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { refreshOnNextNavigate } from "@/hooks/useRefreshOnNavigate";
import { useResultScreen } from "@/hooks/useResultScreen";
import { useShowToast } from "@/hooks/useShowToast";
import { useUserProfile } from "@/hooks/useUser";
import { insertCompletedLesson } from "@/services/fetcher/lesson/completedLesson";
import { useLessonStore } from "@/stores/lesson";
import { calculatePercentage, normalizeError } from "@/utils";

// Extracted so swiping doesn't depend on `currentIndex` React state at all —
// each card reads the shared carouselProgress value directly on the UI
// thread to decide its own zIndex, so a swipe never has to re-render the
// screen (and re-create this renderItem) just to flip which card is on top.
const CarouselCard = memo(function CarouselCard({
	title,
	explanation,
	index,
	carouselProgress,
}: {
	title: string;
	explanation: string;
	index: number;
	carouselProgress: SharedValue<number>;
}) {
	const cardStyle = useAnimatedStyle(() => ({
		zIndex: Math.round(carouselProgress.value) === index ? 10 : 0,
	}));

	return (
		<Animated.View style={cardStyle}>
			<View className="inset-0 absolute bg-background -z-1" />

			<SurfaceCard className="p-0 gap-2 items-start min-h-[70%]">
				{(styles) => (
					<>
						<ScrollView contentContainerClassName="p-6 pr-9 gap-2">
							<Heading className={styles.text()} size="xl">
								{title}
							</Heading>
							<Text className={styles.text({ className: "opacity-90" })}>
								{explanation}
							</Text>
						</ScrollView>
					</>
				)}
			</SurfaceCard>
		</Animated.View>
	);
});

export default function LessonContentScreen() {
	const [isLoading, setLoading] = useState(false);
	const { profile } = useUserProfile("student");

	const { showResult } = useResultScreen();
	const lessonContentData = useLessonStore((state) => state.lessonContentData);
	const { width: screenWidth } = useWindowDimensions();

	const contents = lessonContentData?.contents ?? [];
	const total = contents.length;

	const showToast = useShowToast();

	const carouselRef = useRef<CarouselRef>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const isFirst = currentIndex === 0;
	const isLast = currentIndex === total - 1;

	// Continuous drag position (0 to total - 1, fractional mid-swipe),
	// updated on the UI thread every frame — this is what makes the
	// progress bar track the finger instead of only the settled page.
	const carouselProgress = useSharedValue(0);
	const progressPercent = useDerivedValue(() => {
		if (total <= 1) return 100;
		const clamped = Math.min(Math.max(carouselProgress.value, 0), total - 1);
		return interpolate(clamped, [0, total - 1], [100 / total, 100]);
	});

	// Bouncy "come press me" pop on the done button, fired once each time
	// the carousel settles on the last item (not on every mid-drag frame).
	const doneButtonScale = useSharedValue(1);
	const doneButtonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: doneButtonScale.value }],
	}));

	useEffect(() => {
		if (!isLast) return;
		doneButtonScale.value = withSequence(
			withSpring(1.1, AnimationConfig.spring.snappy),
			withSpring(1, AnimationConfig.spring.bouncy),
		);
	}, [isLast]);

	const itemAnimation: CarouselItemAnimation = useCallback(
		(relativeProgress) => {
			"worklet";

			return {
				opacity: interpolate(
					relativeProgress,
					[-2, -1, 0, 1, 2],
					[0, 0.4, 1, 0.4, 0],
				),
				zIndex: 100 - Math.floor(Math.abs(relativeProgress) * 10),
				transform: [
					{
						translateX: interpolate(
							relativeProgress,
							[-1, 0, 1],
							[-screenWidth, 0, screenWidth],
						),
					},
					{
						rotateZ: `${interpolate(relativeProgress, [-1, 0, 1], [-8, 0, 8])}deg`,
					},
					{ scale: interpolate(relativeProgress, [-1, 0, 1], [0.85, 1, 0.85]) },
				],
			};
		},
		[screenWidth],
	);

	const handleNext = useCallback(async () => {
		if (isLast) {
			try {
				if (!profile || !lessonContentData) return;
				setLoading(true);

				await insertCompletedLesson(lessonContentData.id, profile.user_id);

				showResult({
					type: "success",
					title: "Materi Selesai",
					subtitle: "Kamu sudah menyelesaikan materi pembelajaran keren!",
					icon: BookCheck,
				});

				refreshOnNextNavigate();
			} catch (e) {
				const { uiMessage } = normalizeError(e, "Lesson reader");
				showToast({ title: uiMessage });
			} finally {
				setLoading(false);
			}

			return;
		}

		// onSnapToItem drives currentIndex — no need to set it here too.
		carouselRef.current?.next();
	}, [isLast, showToast]);

	const handlePrev = useCallback(() => {
		if (isFirst) return;
		carouselRef.current?.prev();
	}, [isFirst]);

	const renderItem = useCallback(
		({ item, index }: { item: (typeof contents)[number]; index: number }) => (
			<CarouselCard
				title={item.title}
				explanation={item.explanation}
				index={index}
				carouselProgress={carouselProgress}
			/>
		),
		[carouselProgress],
	);

	if (!lessonContentData || total === 0) {
		return <Redirect href={"/(student)/learn/overview"} />;
	}

	return (
		<Screen
			isLoading={isLoading}
			headerComponent={
				<>
					<ScreenHeader
						title={lessonContentData.title}
						leftComponent={<BackButton />}
					/>

					<ProgressBar
						text={`${currentIndex + 1} dari ${total}`}
						value={calculatePercentage(currentIndex + 1, total)}
						progress={progressPercent}
					/>
				</>
			}
			space="4xl"
			overlayComponent={
				<BottomPanel>
					<HStack space="md">
						<Button
							fill
							size="cta"
							label="Sebelumnya"
							variant="outline"
							onPress={handlePrev}
							isDisabled={isLoading || isFirst}
						/>
						<Animated.View className={"flex-1"} style={doneButtonAnimatedStyle}>
							<Button
								size="cta"
								fill
								label={isLast ? "Selesai" : "Lanjut"}
								onPress={handleNext}
								isLoading={isLoading}
							/>
						</Animated.View>
					</HStack>
				</BottomPanel>
			}
			contentComponent={
				<View className="flex-1 pt-12">
					<Carousel
						ref={carouselRef}
						data={contents}
						progress={carouselProgress}
						animation={{ type: "spring", ...AnimationConfig.spring.heavy }}
						itemAnimation={itemAnimation}
						style={{ flex: 1, overflow: "visible" }}
						contentContainerStyle={{
							overflow: "visible",
							flexGrow: 1,
						}}
						onSnapToItem={setCurrentIndex}
						renderItem={renderItem}
					/>
				</View>
			}
		/>
	);
}
