import { useState } from "react";

import {
  ImageSourcePropType,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";

import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  measure,
  withSpring,
} from "react-native-reanimated";

import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import { AnimationConfig } from "@/components/animation/presets";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PREVIEW_PX = 280; // the actual rendered pixel size of UserAvatar size="lg"

type ProfileRole =
  | { type: "student"; grade?: string; nis?: string }
  | { type: "teacher"; subject?: string };

interface ProfileHeaderProps {
  name: string;
  imageSource?: ImageSourcePropType;
  layout?: "centered" | "row";
  size?: "lg" | "md";
  role: ProfileRole;
}

export function ProfileHeader({
  name,
  imageSource,
  layout = "centered",
  size = "lg",
  role,
}: ProfileHeaderProps) {
  const avatarRef = useAnimatedRef<typeof Pressable>();
  const [previewVisible, setPreviewVisible] = useState(false);

  const targetLeft = (SCREEN_W - PREVIEW_PX) / 2;
  const targetTop = (SCREEN_H - PREVIEW_PX) / 2;

  const opacity = useSharedValue(0);
  const radius = useSharedValue(0);

  const top = useSharedValue(0);
  const left = useSharedValue(0);
  const boxSize = useSharedValue(0);

  // remember starting rect so close() can animate back to it
  const startTop = useSharedValue(0);
  const startLeft = useSharedValue(0);
  const startSize = useSharedValue(0);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: top.value,
    left: left.value,
    width: boxSize.value,
    height: boxSize.value,
    borderRadius: radius.value,
  }));

  const openPreview = () => {
    setPreviewVisible(true);
    scheduleOnUI(() => {
      "worklet";
      const m = measure(avatarRef);
      if (!m) return;

      // seed "current" at the small avatar's exact position/size...
      startTop.value = top.value = m.pageY;
      startLeft.value = left.value = m.pageX;
      startSize.value = boxSize.value = m.width;
      radius.value = m.width / 2;

      // ...then animate straight to the centered target box
      top.value = withSpring(targetTop, AnimationConfig.spring.snappy);
      left.value = withSpring(targetLeft, AnimationConfig.spring.snappy);
      boxSize.value = withSpring(PREVIEW_PX, AnimationConfig.spring.snappy);

      opacity.value = withTiming(1, AnimationConfig.timing.fastEnter);
      radius.value = withTiming(12, AnimationConfig.timing.smoothEnter);
    });
  };

  const closePreview = () => {
    top.value = withTiming(startTop.value, AnimationConfig.timing.smoothExit);
    left.value = withTiming(startLeft.value, AnimationConfig.timing.smoothExit);
    boxSize.value = withTiming(
      startSize.value,
      AnimationConfig.timing.smoothExit,
      (finished) => {
        "worklet";
        if (finished) scheduleOnRN(setPreviewVisible, false);
      },
    );

    opacity.value = withTiming(0, AnimationConfig.timing.fastExit);
    radius.value = withTiming(
      startSize.value / 2,
      AnimationConfig.timing.smoothExit,
    );
  };

  const subtitle =
    role.type === "student"
      ? role.grade
        ? `${role.grade} ∙ Siswa`
        : "Siswa"
      : role.subject
        ? `${role.subject} (Admin) ∙ Guru`
        : "Admin ∙ Guru";

  const id = role.type === "student" ? role.nis : undefined;

  const avatarClassName = cn(
    size === "lg" && "w-32 h-32",
    size === "md" && "w-28 h-28",
  );

  return (
    <>
      <Box
        className={cn(
          "items-center gap-2",
          layout === "centered" ? "justify-center p-7" : "flex-row py-4 gap-6",
        )}
      >
        <Pressable ref={avatarRef} onPress={openPreview}>
          <UserAvatar
            name={name}
            imageSource={imageSource}
            className={cn(previewVisible && "opacity-0")}
            size={size === "lg" ? "lg" : "md"}
          />
        </Pressable>

        <VStack
          className={layout === "centered" ? "items-center mt-2" : undefined}
        >
          <Heading size={size === "lg" ? "2xl" : "xl"}>{name}</Heading>
          <Text size="lg">{subtitle}</Text>
          {id && <Text>{id}</Text>}
        </VStack>
      </Box>

      <Modal visible={previewVisible} transparent onRequestClose={closePreview}>
        <Animated.View
          className="absolute inset-0 bg-black/80"
          style={bgAnimatedStyle}
        />
        <Pressable className="flex-1" onPress={closePreview}>
          <Animated.View className="overflow-hidden" style={animatedStyle}>
            <UserAvatar
              className="w-full h-full rounded-none"
              name={name}
              imageSource={imageSource}
              size={size === "lg" ? "lg" : "md"}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}
