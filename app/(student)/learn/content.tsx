import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { EaseView } from "react-native-ease";
import { Redirect } from "expo-router";

import { BackButton } from "@/components/domain";
import {
  BottomPanel,
  Button,
  ProgressBar,
  Screen,
  ScreenHeader,
  Spacer,
  SurfaceCard,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useLessonStore } from "@/stores/lessonAction";
import { calculatePercentage } from "@/utils";

type LessonContent = {
  id: string;
  title: string;
  explanation: string;
};

type Direction = "next" | "prev";
// idle: resting at center. exiting: sliding old content off.
// entering: content already swapped, snapped off-screen on the far side, about to spring in.
type Phase = "idle" | "exiting" | "entering";

const STACK_DEPTH = 2;
const CARD_HEIGHT = 380;
const EXIT_DISTANCE = 420;
const EXIT_DURATION = 180;
const ENTER_TILT = 6;

export default function LessonContentScreen() {
  const lessonContentData = useLessonStore((state) => state.lessonContentData);
  const colors = useThemeColors();

  const contents = lessonContentData?.contents ?? [];
  const total = contents.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [phase, setPhase] = useState<Phase>("idle");
  const isBusyRef = useRef(false);

  const currentCard = contents[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const beginTransition = useCallback(
    (dir: Direction) => {
      if (isBusyRef.current || !currentCard) return;
      if (dir === "next" && isLast) return;
      if (dir === "prev" && isFirst) return;

      isBusyRef.current = true;
      setDirection(dir);
      setPhase("exiting");
    },
    [currentCard, isFirst, isLast],
  );

  const handleNext = useCallback(
    () => beginTransition("next"),
    [beginTransition],
  );
  const handlePrev = useCallback(
    () => beginTransition("prev"),
    [beginTransition],
  );

  // Step 2 of 3: exit finished (old content fully off-screen + invisible).
  // Swap the content now, while nothing is visible, then move straight to "entering".
  const handleTransitionEnd = useCallback(
    ({ finished }: { finished: boolean }) => {
      if (!finished) return;

      if (phase === "exiting") {
        setCurrentIndex((i) => (direction === "next" ? i + 1 : i - 1));
        setPhase("entering");
        return;
      }

      if (phase === "idle") {
        // The spring-in from "entering" -> "idle" just completed.
        isBusyRef.current = false;
      }
    },
    [phase, direction],
  );

  // Step 3 of 3: we're invisible and snapped to the entry edge — release the
  // spring on the very next frame so it actually animates instead of jumping.
  useEffect(() => {
    if (phase !== "entering") return;
    const raf = requestAnimationFrame(() => setPhase("idle"));
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (!lessonContentData || total === 0) {
    return <Redirect href={"/(student)/learn/overview"} />;
  }

  const exitTarget = {
    translateX: direction === "next" ? -EXIT_DISTANCE : EXIT_DISTANCE,
    rotate: direction === "next" ? -ENTER_TILT : ENTER_TILT,
    opacity: 0,
    scale: 0.94,
  };

  // Opposite edge from where it exited — this is where "entering" snaps to.
  const enterEdge = {
    translateX: direction === "next" ? EXIT_DISTANCE : -EXIT_DISTANCE,
    rotate: direction === "next" ? ENTER_TILT : -ENTER_TILT,
    opacity: 0,
    scale: 0.96,
  };

  const restingTarget = { translateX: 0, rotate: 0, opacity: 1, scale: 1 };

  const activeAnimate =
    phase === "exiting"
      ? exitTarget
      : phase === "entering"
        ? enterEdge
        : restingTarget;

  const activeTransition =
    phase === "exiting"
      ? { type: "timing" as const, duration: EXIT_DURATION }
      : phase === "entering"
        ? { type: "none" as const }
        : { type: "spring" as const, damping: 15, stiffness: 150 };

  const isBusy = phase !== "idle";

  return (
    <Screen
      scrollable
      headerComponent={
        <ScreenHeader
          title={lessonContentData.title}
          leftComponent={<BackButton />}
        />
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
              disabled={isFirst || isBusy}
            />
            <Button
              size="cta"
              label={isLast ? "Selesai" : "Selanjutnya"}
              onPress={handleNext}
              disabled={isBusy}
            />
          </HStack>
        </BottomPanel>
      }
      contentComponent={
        <>
          <ProgressBar
            text={`${currentIndex + 1} dari ${total}`}
            value={calculatePercentage(currentIndex + 1, total)}
          />

          <View style={styles.stackWrapper}>
            {/* Keyed by slot, not card id, so these never remount — just re-target */}
            {Array.from({ length: STACK_DEPTH }).map((_, i) => {
              const depth = STACK_DEPTH - i;
              const peekCard = contents[currentIndex + depth];
              if (!peekCard) return null;

              return (
                <EaseView
                  key={`peek-slot-${depth}`}
                  style={[styles.cardLayer, { backgroundColor: colors.card }]}
                  animate={{
                    translateY: depth * 14,
                    scale: 1 - depth * 0.05,
                    opacity: 1 - depth * 0.32,
                  }}
                  transition={{ type: "spring", damping: 16, stiffness: 160 }}
                  pointerEvents="none"
                />
              );
            })}

            {/* Single persistent instance — content swaps mid-flight, view never remounts */}
            {currentCard && (
              <EaseView
                key="active-card"
                style={styles.cardLayer}
                animate={activeAnimate}
                transition={activeTransition}
                onTransitionEnd={handleTransitionEnd}
              >
                <SurfaceCard style={styles.surfaceCard}>
                  <Text
                    style={[styles.cardTitle, { color: colors.foreground }]}
                  >
                    {currentCard.title}
                  </Text>
                  <Spacer height={12} />
                  <Text
                    style={[
                      styles.cardExplanation,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {currentCard.explanation}
                  </Text>
                </SurfaceCard>
              </EaseView>
            )}
          </View>

          <Spacer height={108} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  stackWrapper: {
    height: CARD_HEIGHT,
    position: "relative",
  },
  cardLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    borderRadius: 24,
  },
  surfaceCard: {
    flex: 1,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardExplanation: {
    fontSize: 15,
    lineHeight: 22,
  },
});
