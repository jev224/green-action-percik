import { useEffect } from "react";

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProgressBarProps {
  text?: string;
  value: number;
  /**
   * Optional shared value (0-100) to track directly, frame-by-frame,
   * instead of animating toward `value` with an easing curve. Pass a
   * carousel's drag/progress shared value here to make the bar follow
   * a swipe in real time. When omitted, behavior is unchanged.
   */
  progress?: SharedValue<number>;
}

const AnimatedProgressFilledTrack =
  Animated.createAnimatedComponent(ProgressFilledTrack);

export function ProgressBar({ text, value, progress }: ProgressBarProps) {
  const animatedValue = useSharedValue(value);

  useEffect(() => {
    // If an external shared value is driving the bar, don't fight it
    // with our own eased animation toward `value`.
    if (progress) return;

    animatedValue.value = withTiming(value, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${(progress ?? animatedValue).value}%`,
  }));

  return (
    <VStack className="gap-1">
      {text && (
        <Text size="md" className="opacity-70">
          {text}
        </Text>
      )}

      <Progress value={value} className="h-2.5">
        <AnimatedProgressFilledTrack
          className="rounded-full"
          style={animatedStyle}
        />
      </Progress>
    </VStack>
  );
}
