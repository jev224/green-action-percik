import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import Animated, {
  FadeOut,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { EaseView } from "react-native-ease";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";

interface FilterChipsProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string | null) => void;
  allLabel?: string;
}

export function FilterChips({
  options,
  selected,
  onSelect,
  allLabel = "Semua",
}: FilterChipsProps) {
  if (options.length === 0) return null;

  return (
    <Box className="flex-row flex-wrap gap-2">
      <Chip
        label={allLabel}
        isActive={selected === null}
        onPress={() => onSelect(null)}
      />

      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          isActive={selected === option}
          onPress={() => onSelect(option)}
        />
      ))}
    </Box>
  );
}

function Chip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const { isPressing, bind } = usePressFeedback(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isPressing ? 0.9 : 1, {
          damping: 9,
          stiffness: 500,
          mass: 0.45,
        }),
      },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={bind.onPressIn}
      onPressOut={bind.onPressOut}
    >
      <Animated.View
        exiting={FadeOut.duration(120)}
        style={animatedStyle}
        className={cn(
          "px-4 py-1.5 rounded-lg border overflow-hidden",
          "bg-muted border-border",
        )}
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
          }}
        />

        <Text
          className={
            isActive
              ? "text-primary-foreground font-bold"
              : "text-muted-foreground"
          }
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
