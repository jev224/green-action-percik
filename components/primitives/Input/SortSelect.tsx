import React, { useState } from "react";

import {
  Select,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { ArrowDownWideNarrow } from "lucide-react-native";
import {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import {
  AnimatedPressable,
  AnimatedSelectContent,
  AnimatedSelectTrigger,
} from "@/components/animation/animatedComponent";
import { Box } from "@/components/ui/box";
import { AnimationConfig } from "@/components/animation/presets";
import { LayoutChangeEvent, useWindowDimensions } from "react-native";
import { EaseView } from "react-native-ease";
import { scheduleOnRN } from "react-native-worklets";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

export type SortDirection = "asc" | "desc";

export interface SortState<TField extends string = string> {
  field: TField;
  direction: SortDirection;
}

export interface SortFieldOption<TField extends string> {
  field: TField;
  label: string;
  ascLabel?: string;
  descLabel?: string;
}

interface SortSelectProps<TField extends string> {
  options: SortFieldOption<TField>[];
  value: SortState<TField> | null;
  onChange: (value: SortState<TField> | null) => void;
  noneLabel?: string;
}

const stateToValue = <TField extends string>(
  state: SortState<TField> | null,
) => (state ? `${state.field}-${state.direction}` : "none");

const valueToState = <TField extends string>(
  value: string,
): SortState<TField> | null => {
  if (value === "none") return null;
  const separatorIndex = value.lastIndexOf("-");
  const field = value.slice(0, separatorIndex) as TField;
  const direction = value.slice(separatorIndex + 1) as SortDirection;
  return { field, direction };
};

export function SortSelect<TField extends string>({
  options,
  value,
  onChange,
  noneLabel = "Tanpa urutan",
}: SortSelectProps<TField>) {
  const { height } = useWindowDimensions();

  const { isPressing, bind } = usePressFeedback(1);

  const [isOpen, setIsOpen] = useState(false);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  const handleOpen = () => {
    if (!isAnimating.get()) {
      opacity.set(0);
      translateY.set(height);
    }

    isAnimating.set(true);

    setIsOpen(true);

    opacity.set(withSpring(1, AnimationConfig.timing.smoothEnter));

    translateY.set(
      withSpring(0, AnimationConfig.spring.heavy, (finished) => {
        "worklet";
        if (finished) isAnimating.set(false);
      }),
    );
  };

  const handleClose = () => {
    isAnimating.set(true);

    opacity.set(withTiming(0, AnimationConfig.timing.fastExit));

    translateY.set(
      withTiming(height, AnimationConfig.timing.smoothExit, (finished) => {
        "worklet";

        if (finished) {
          scheduleOnRN(setIsOpen, false);
          isAnimating.set(false);
        }
      }),
    );
  };

  const currentValue = stateToValue(value);

  const triggerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isPressing ? 0.9 : 1, AnimationConfig.spring.bouncy),
      },
    ],
  }));

  const OVERSCROLL = 100;
  const RESISTANCE = 0.25;

  const [isDragging, setIsDragging] = useState(false);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scheduleOnRN(setIsDragging, true);
    })
    .onUpdate((event) => {
      const y = event.translationY;

      if (y > OVERSCROLL) {
        // Down overscroll
        translateY.value = OVERSCROLL + (y - OVERSCROLL) * RESISTANCE;
      } else if (y < -OVERSCROLL) {
        // Up overscroll
        translateY.value = -OVERSCROLL + (y + OVERSCROLL) * RESISTANCE;
      } else {
        // Normal movement
        translateY.value = y;
      }
    })
    .onEnd((event) => {
      scheduleOnRN(setIsDragging, false);

      const shouldClose = event.translationY > 100 || event.velocityY > 800;

      if (shouldClose) {
        scheduleOnRN(handleClose);
        return;
      }

      translateY.value = withSpring(0, AnimationConfig.spring.snappy);
    });

  const isActive = currentValue !== "none";

  return (
    <Select
      isFocused={isActive}
      selectedValue={currentValue}
      onValueChange={(v) => onChange(valueToState<TField>(v))}
      onClose={handleClose}
    >
      <AnimatedSelectTrigger
        className="flex-1 self-start items-center justify-center aspect-square rounded-lg border-2"
        variant="rounded"
        size="lg"
        style={triggerAnimatedStyle}
        onPress={handleOpen}
        onPressIn={bind.onPressIn}
        onPressOut={bind.onPressOut}
      >
        <SelectIcon
          className={cn("w-6 h-6", isActive && "text-primary")}
          as={ArrowDownWideNarrow}
        />
      </AnimatedSelectTrigger>

      <SelectPortal isOpen={isOpen} onClose={handleClose}>
        <AnimatedPressable
          className="absolute inset-0 bg-black/80"
          onPress={handleClose}
          style={backdropAnimatedStyle}
        />

        <AnimatedPressable onPress={handleClose} style={menuAnimatedStyle}>
          <AnimatedSelectContent
            className="absolute bottom-0 left-0 right-0 p-3 bg-transparent"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: 0 }}
          >
            <Box className="absolute inset-0 -bottom-70 rounded-xl bg-background" />

            <GestureDetector gesture={panGesture}>
              <Box className="w-full p-2 items-center justify-center">
                <EaseView animate={{ scale: isDragging ? 1.2 : 1 }}>
                  <Box className="w-14 h-2 bg-foreground/70 rounded-full" />
                </EaseView>
              </Box>
            </GestureDetector>

            {options.map(({ field, label, ascLabel, descLabel }) => (
              <React.Fragment key={field}>
                <SelectItem
                  className="py-4"
                  label={ascLabel ?? `${label} (Naik)`}
                  value={`${field}-asc`}
                />
                <SelectItem
                  className="py-4"
                  label={descLabel ?? `${label} (Turun)`}
                  value={`${field}-desc`}
                />
              </React.Fragment>
            ))}

            <SelectItem label={noneLabel} value="none" />
          </AnimatedSelectContent>
        </AnimatedPressable>
      </SelectPortal>
    </Select>
  );
}
