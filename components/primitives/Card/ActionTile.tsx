// components/primitives/Card/ActionTile.tsx
//
// Pressable "thumbnail + title + description" tile — module cards, menu
// entries, anything you tap to go somewhere or do something. Replaces
// cards/ActionCard.tsx.
//
// Old ActionCard took `action: { type: "click" | "redirect" }` and called
// useNavigation() itself. Same fix as Button: this only takes `onPress`.
// If a screen needs to navigate, it passes `onPress={() => navigateTo(href)}`.

import { ComponentProps, ReactNode } from "react";
import { ImageSourcePropType, Pressable } from "react-native";
import { EaseView } from "react-native-ease";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { SurfaceCard } from "./SurfaceCard";
import type { SemanticColor, SurfaceVariant } from "@/components/styles/tokens";
import {
  usePressFeedback,
  PRESS_SCALE_TRANSITION,
} from "@/hooks/usePressFeedback";

interface ActionTileProps {
  title: string;
  description?: string;
  imageSource?: ImageSourcePropType;
  icon?: ComponentProps<typeof Icon>["as"];
  color?: SemanticColor;
  variant?: SurfaceVariant;
  onPress?: () => void;
  trailing?: ReactNode;
  className?: string;
}

export function ActionTile({
  title,
  description,
  imageSource,
  icon,
  color = "neutral",
  variant = "outline",
  onPress,
  trailing,
  className,
}: ActionTileProps) {
  const hasThumbnail = imageSource || icon;
  const { bind, scaleAnimation } = usePressFeedback(0.97);

  const body = (
    <SurfaceCard color={color} variant={variant} className={className}>
      {(styles) => (
        <HStack space="md" className="items-center">
          {hasThumbnail && (
            <Box
              className={`size-16 rounded-sm items-center justify-center overflow-hidden ${styles.thumbnail}`}
            >
              {imageSource && (
                <Image className="w-full h-full" source={imageSource} />
              )}
              {icon && !imageSource && (
                <Icon className={`w-8 h-8 ${styles.icon}`} as={icon} />
              )}
            </Box>
          )}

          <VStack className="flex-1" space="xs">
            <Heading size="md" className={styles.text} numberOfLines={2}>
              {title}
            </Heading>
            {description && (
              <Text
                size="sm"
                className={`opacity-80 ${styles.text}`}
                numberOfLines={2}
              >
                {description}
              </Text>
            )}
          </VStack>

          {trailing}
        </HStack>
      )}
    </SurfaceCard>
  );

  if (!onPress) return body;

  return (
    <EaseView
      animate={scaleAnimation}
      transition={{ transform: PRESS_SCALE_TRANSITION }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={bind.onPressIn}
        onPressOut={bind.onPressOut}
      >
        {body}
      </Pressable>
    </EaseView>
  );
}
