import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Redirect } from "expo-router";

import {
  Carousel,
  CarouselItemAnimation,
  CarouselRef,
} from "react-native-reanimated-carousel";

import { ScrollView } from "react-native-gesture-handler";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

import { BackButton } from "@/components/domain";
import {
  BottomPanel,
  Button,
  ProgressBar,
  Screen,
  ScreenHeader,
  SurfaceCard,
} from "@/components/primitives";

import { AnimationConfig } from "@/components/animation/presets";

import { useLessonStore } from "@/stores/lessonAction";

import { useShowToast } from "@/hooks/useShowToast";
import { useNavigation } from "@/hooks/useNavigation";

import { calculatePercentage } from "@/utils";

export default function LessonContentScreen() {
  const { navigateTo } = useNavigation();
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

  const handleNext = useCallback(() => {
    if (isLast) {
      showToast({
        title: "Materi Selesai",
        description: "Kamu sudah menyelesaikan materi pembelajaran keren!",
      });
      navigateTo("/(student)/(tabs)/learn");
      return;
    }

    // onSnapToItem drives currentIndex — no need to set it here too.
    carouselRef.current?.next();
  }, [isLast, showToast, navigateTo]);

  const handlePrev = useCallback(() => {
    if (isFirst) return;
    carouselRef.current?.prev();
  }, [isFirst]);

  if (!lessonContentData || total === 0) {
    return <Redirect href={"/(student)/learn/overview"} />;
  }

  return (
    <Screen
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
              size="cta"
              label="Sebelumnya"
              variant="outline"
              onPress={handlePrev}
              disabled={isFirst}
            />
            <Animated.View className={"flex-1"} style={doneButtonAnimatedStyle}>
              <Button
                size="cta"
                fill
                label={isLast ? "Selesai" : "Lanjut"}
                onPress={handleNext}
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
            renderItem={({ item, index }) => (
              <SurfaceCard
                className="p-0 gap-2 items-start min-h-[70%]"
                style={{ zIndex: currentIndex === index ? 10 : 0 }}
              >
                {(styles) => (
                  <>
                    <View className="inset-0 absolute bg-background -z-1" />

                    <ScrollView contentContainerClassName="p-6 pr-9 gap-2">
                      <Heading className={styles.text()} size="xl">
                        {item.title}
                      </Heading>
                      <Text
                        className={styles.text({ className: "opacity-90" })}
                      >
                        {item.explanation}
                      </Text>
                    </ScrollView>
                  </>
                )}
              </SurfaceCard>
            )}
          />
        </View>
      }
    />
  );
}
