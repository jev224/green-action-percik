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
import { AnimationConfig } from "@/components/animation/presets";

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface StudentListItemProps {
  student: StudentData;
  onPress?: (student: StudentData) => void;
}

export function StudentListItem({ student, onPress }: StudentListItemProps) {
  const { name, grade, point, photo_url } = student;

  const colors = useThemeColors();
  const { bind, scaleAnimation, isPressing } = usePressFeedback(0.96);

  const animatedStyle = useAnimatedStyle(() => {
    const paddingVertical = interpolate(isPressing ? 1 : 0, [0, 1], [16, 24]);
    const paddingHorizontal = interpolate(isPressing ? 1 : 0, [0, 1], [0, 12]);

    return {
      paddingVertical: withSpring(
        paddingVertical,
        AnimationConfig.spring.snappy,
      ),

      transform: [
        {
          scale: withSpring(
            isPressing ? 0.97 : 1,
            AnimationConfig.spring.snappy,
          ),
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
      delayHoverIn={0}
      unstable_pressDelay={100}
    >
      <AnimatedBox style={animatedStyle}>
        <Box className="absolute -right-4 -left-4 top-0 bottom-0 rounded-lg overflow-hidden">
          <EaseView
            animate={{
              opacity: isPressing ? 0.2 : 0,
            }}
            transition={{
              type: "timing",
              duration: 100,
            }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: colors.foreground,
            }}
          />
        </Box>

        <EaseView animate={scaleAnimation}>
          <Box className="flex-row items-center gap-4">
            <UserAvatar
              name={name}
              size="sm"
              imageSource={photo_url ? { uri: photo_url } : undefined}
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
        </EaseView>
      </AnimatedBox>
    </Pressable>
  );
}
