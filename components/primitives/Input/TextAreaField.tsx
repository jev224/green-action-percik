// components/primitives/Input/TextAreaField.tsx
// Was inputs/TextAreaField.tsx.
//
// BUG FIXED: the old file had `className="min-h-20 mb-8 bg-amber-300"` on
// the outer wrapper — bg-amber-300 is a bright yellow debug color that
// someone used to see the auto-grow boundary while building this, and it
// never got removed. Every TextArea in the app was rendering with a
// yellow background. Removed here.

import React, { ComponentProps, useState } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

const MAX_GROW_HEIGHTS = {
  md: 320,
} as const;

type MaxGrowSize = keyof typeof MAX_GROW_HEIGHTS;

const MIN_HEIGHT = 44;

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

type TextAreaFieldProps = ComponentProps<typeof TextareaInput> & {
  canGrow?: boolean;
  maxGrowSize?: MaxGrowSize;
};

export function TextAreaField({
  canGrow = false,
  maxGrowSize = "md",
  onChangeText,
  ...props
}: TextAreaFieldProps) {
  const [text, setText] = useState(props.value ?? props.defaultValue ?? "");
  const height = useSharedValue(MIN_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      className="min-h-60 mb-4"
      style={canGrow ? animatedStyle : undefined}
    >
      <Textarea className="h-full rounded-md py-1">
        <TextareaInput
          {...props}
          multiline
          onChangeText={(t) => {
            setText(t);
            onChangeText?.(t);
          }}
        />

        {/* hidden mirror for measuring content height */}
        <Text
          className="absolute right-0 left-0 top-0 opacity-0 -z-10"
          onLayout={(e) => {
            if (!canGrow) return;
            const measured = clamp(
              e.nativeEvent.layout.height,
              MIN_HEIGHT,
              MAX_GROW_HEIGHTS[maxGrowSize],
            );
            height.value = withTiming(measured, {
              duration: 150,
              easing: Easing.out(Easing.quad),
            });
          }}
        >
          {text || " "}
        </Text>
      </Textarea>
    </Animated.View>
  );
}
