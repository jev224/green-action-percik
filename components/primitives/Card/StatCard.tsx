// components/primitives/Card/StatCard.tsx
//
// "Title + big number" card — student points, active-student count, etc.
// Replaces cards/StatisticCard.tsx. Same color/variant theming as
// ActionTile, because both now share SurfaceCard instead of each
// hand-rolling their own 24-block compoundVariants list.

import { ComponentProps } from "react";
import { ImageSourcePropType } from "react-native";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { SurfaceCard } from "./SurfaceCard";
import type { SemanticColor, SurfaceVariant } from "@/components/styles/tokens";

interface StatCardProps {
  title: string;
  stats: string;
  imageSource?: ImageSourcePropType;
  icon?: ComponentProps<typeof Icon>["as"];
  color?: SemanticColor;
  variant?: SurfaceVariant;
  className?: string;
}

export function StatCard({
  title,
  stats,
  imageSource,
  icon,
  color = "primary",
  variant = "solid",
  className,
}: StatCardProps) {
  const hasThumbnail = imageSource || icon;

  return (
    <SurfaceCard color={color} variant={variant} className={className}>
      {(styles) => (
        <Box className="flex-row items-center gap-3">
          {hasThumbnail && (
            <Box
              className={`size-10 rounded-sm overflow-hidden ${styles.thumbnail}`}
            >
              {imageSource && (
                <Image className="w-full h-full" source={imageSource} />
              )}
              {icon && !imageSource && (
                <Icon className={`w-full h-full ${styles.icon}`} as={icon} />
              )}
            </Box>
          )}

          <VStack className="flex-1">
            <Heading
              size="sm"
              className={`font-medium ${styles.text}`}
              numberOfLines={1}
            >
              {title}
            </Heading>
            <Heading size="2xl" className={styles.text} numberOfLines={1}>
              {stats}
            </Heading>
          </VStack>
        </Box>
      )}
    </SurfaceCard>
  );
}
