import { View, Pressable, Text as RNText } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Icon } from "@/components/ui/icon";
import type { ComponentProps } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AnimationConfig } from "@/components/animation/presets";
import { EaseView } from "react-native-ease";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: ComponentProps<typeof Icon>["as"];
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View className={cn("flex-row w-full gap-3", className)}>
      {options.map((option) => {
        const isActive = option.value === value;

        const colors = useThemeColors();
        const { isPressing, bind } = usePressFeedback(1);

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            {
              scale: withSpring(
                isPressing ? 0.9 : 1,
                AnimationConfig.spring.bouncy,
              ),
            },
          ],
        }));

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            onPressIn={bind.onPressIn}
            onPressOut={bind.onPressOut}
            className="flex-1"
          >
            <Animated.View
              style={animatedStyle}
              className="flex-1 items-center justify-center rounded-md py-4 px-4 border border-border overflow-hidden bg-muted"
            >
              <EaseView
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  type: "timing",
                  duration: 120,
                }}
                style={{
                  backgroundColor: colors.primary,
                  position: "absolute",
                  inset: 0,
                  zIndex: -1,
                }}
              />

              {option.icon && (
                <Icon
                  as={option.icon}
                  className={cn(
                    "mb-2",
                    isActive ? "text-primary-foreground" : "text-foreground",
                  )}
                />
              )}
              <RNText
                className={cn(
                  "font-bold text-base",
                  isActive ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {option.label}
              </RNText>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}
