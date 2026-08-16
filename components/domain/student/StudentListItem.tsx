import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import type { StudentData } from "./types";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";
import { EaseView } from "react-native-ease";

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface StudentListItemProps {
  student: StudentData;
  onPress?: (student: StudentData) => void;
}

export function StudentListItem({ student, onPress }: StudentListItemProps) {
  const { name, grade, point, avatarUrl } = student;

  const colors = useThemeColors();
  const { isPressing, bind } = usePressFeedback(1);

  const animatedStyle = useAnimatedStyle(() => {
    const paddingVertical = interpolate(isPressing ? 1 : 0, [0, 1], [16, 12]);
    const paddingHorizontal = interpolate(isPressing ? 1 : 0, [0, 1], [0, 12]);

    return {
      paddingVertical: withSpring(paddingVertical, {
        damping: 18,
        stiffness: 400,
        mass: 0.5,
      }),
      paddingHorizontal: withSpring(paddingHorizontal, {
        damping: 18,
        stiffness: 400,
        mass: 0.5,
      }),
      transform: [
        {
          scale: withSpring(isPressing ? 0.97 : 1, {
            damping: 16,
            stiffness: 450,
            mass: 0.5,
          }),
        },
      ],
    };
  });

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => onPress?.(student)}
      onPressIn={bind.onPressIn}
      onPressOut={bind.onPressOut}
    >
      <AnimatedBox className="rounded-lg overflow-hidden" style={animatedStyle}>
        <EaseView
          animate={{
            opacity: isPressing ? 0.2 : 0,
          }}
          transition={{
            type: "timing",
            duration: 100,
          }}
          style={{
            backgroundColor: colors.foreground,
            position: "absolute",
            inset: 0,
          }}
        />

        <Box className="flex-row items-center gap-4">
          <UserAvatar
            name={name}
            size="sm"
            imageSource={avatarUrl ? { uri: avatarUrl } : undefined}
          />

          <Box className="flex-1">
            <Heading numberOfLines={1}>{name}</Heading>
            {grade && <Text>{grade}</Text>}
          </Box>

          {point != null && (
            <Heading className="text-primary font-semibold" size="lg">
              {point} Poin
            </Heading>
          )}
        </Box>
      </AnimatedBox>
    </Pressable>
  );
}
