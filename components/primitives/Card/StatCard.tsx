// components/primitives/Card/StatCard.tsx
//
// "Title + big number" card — student points, active-student count, etc.
// Replaces cards/StatisticCard.tsx.
//
// Back to `tva`, per your call — this matches how the original
// StatisticCard.tsx (and SegmentedControl/ActionCard) actually built
// variants, and it's the right tool here: compoundVariants are made for
// "these classes only apply when size=X AND color=Y", which is exactly
// this component's shape. My previous cn()-object version worked but
// wasn't consistent with how the rest of your styled components are
// built — reverted.
//
// Icon sizing: the icon fills its container (`w-full h-full`, same as the
// original), so visual weight is controlled by the thumbnail box size —
// bumped default from size-8 (32px) to size-10 (40px) since 32px read as
// thin/small next to the 4xl-scale number below it. This matches how
// icon sizing works everywhere else in this codebase (IconButton,
// ButtonIcon both size via className, never a size/strokeWidth prop) —
// I initially tried a numeric size/strokeWidth prop here and walked it
// back once I checked it against the rest of your code instead of
// guessing at an API I hadn't verified. If "weird" was actually about
// which icon is used (not its size), tell me and I'll swap the icon.

import { tva, cn } from "@gluestack-ui/utils/nativewind-utils";

import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { ComponentProps } from "react";
import { ImageSourcePropType } from "react-native";
import {
  buildColorVariantOptions,
  buildColorsCompoundVariants,
} from "@/components/styles/buildColorsVariants";

// NativeWind extracts class names statically at build time, so these
// can't be generated from a `${color}` template — each color needs its
// literal block below. Adding a new color = copy one block, swap the
// token name in all 3 places (card/icon/title+stats).
const statCardStyle = tva({
  slots: {
    card: "flex-row items-center shadow-none overflow-hidden",
    thumbnail: "rounded-sm overflow-hidden",
    icon: "w-full h-full",
    title: "",
    stats: "",
  },
  variants: {
    size: {
      default: {
        card: "flex-col gap-3 shadow-none px-1",
        title: "font-medium opacity-80",
        thumbnail: "size-8",
      },
      md: {
        card: "min-h-24 px-6",
        title: "font-semibold opacity-80",
        thumbnail: "absolute -right-2 -bottom-4 size-22",
      },
      lg: {
        card: "min-h-38 p-6 pl-8",
        title: "font-semibold w-[70%]",
        stats: "w-[70%]",
        icon: "w-24 h-24",
        thumbnail:
          "absolute right-4 top-0 bottom-0 w-[50%] items-center justify-center",
      },
    },

    color: buildColorVariantOptions(),

    variant: {
      solid: {},
      outline: {},
    },
  },
  compoundVariants: [
    ...buildColorsCompoundVariants((color, { outline, solid }) => [
      {
        color,
        variant: "outline",
        class: {
          card: outline.surface,
          icon: outline.icon,
          title: outline.text,
          stats: outline.text,
        },
      },
      {
        color,
        variant: "solid",
        class: {
          card: solid.surface,
          icon: solid.icon,
          title: solid.text,
          stats: solid.text,
        },
      },
    ]),

    // icon opacity tweaks per size, same as the original
    { size: "md", variant: "outline", class: { icon: "opacity-80" } },
    {
      size: "lg",
      variant: "outline",
      class: { icon: "opacity-90 dark:opacity-100" },
    },
  ],

  defaultVariants: {
    color: "primary",
    variant: "solid",
  },
});

type StatCardVariants = (typeof statCardStyle)["variants"];
export type StatCardSize = keyof StatCardVariants["size"];
export type StatCardColor = keyof StatCardVariants["color"];
export type StatCardVariant = keyof StatCardVariants["variant"];

// Heading size / spacing / line-clamp / VStack order are component props,
// not classNames, so tva can't own them — same parallel-map pattern the
// original file used.
const SIZE_CONFIG: Record<
  StatCardSize,
  {
    titleSize: ComponentProps<typeof Heading>["size"];
    statsSize: ComponentProps<typeof Heading>["size"];
    numberOfLines?: number;
    vstackClassName: string;
    vstackSpace?: ComponentProps<typeof VStack>["space"];
    vstackReversed: boolean;
  }
> = {
  default: {
    titleSize: "sm",
    statsSize: "lg",
    numberOfLines: 1,
    vstackClassName: "items-center",
    vstackReversed: true, // stats renders above title — big number first, label under it
  },
  md: {
    titleSize: "md",
    statsSize: "2xl",
    numberOfLines: 1,
    vstackClassName: "flex-1",
    vstackReversed: false,
  },
  lg: {
    titleSize: "lg",
    statsSize: "4xl",
    vstackClassName: "flex-1",
    vstackSpace: "md",
    vstackReversed: false,
  },
};

interface StatCardProps {
  title: string;
  stats: string;
  imageSource?: ImageSourcePropType;
  icon?: ComponentProps<typeof Icon>["as"];
  size?: StatCardSize;
  color?: StatCardColor;
  variant?: StatCardVariant;
  className?: string;
}

export function StatCard({
  title,
  stats,
  imageSource,
  icon,
  size = "default",
  color = "primary",
  variant = "solid",
  className,
}: StatCardProps) {
  const styles = statCardStyle({ size, color, variant });
  const config = SIZE_CONFIG[size];
  const hasThumbnail = imageSource || icon;

  return (
    <Card className={cn(styles.card(), className)} size="default">
      {hasThumbnail && (
        <Box className={styles.thumbnail()}>
          {imageSource && (
            <Image className="w-full h-full" source={imageSource} />
          )}
          {icon && !imageSource && <Icon as={icon} className={styles.icon()} />}
        </Box>
      )}

      <VStack
        className={config.vstackClassName}
        space={config.vstackSpace}
        reversed={config.vstackReversed}
      >
        <Heading
          className={styles.title()}
          size={config.titleSize}
          numberOfLines={config.numberOfLines}
        >
          {title}
        </Heading>
        <Heading
          className={styles.stats()}
          size={config.statsSize}
          numberOfLines={config.numberOfLines}
        >
          {stats}
        </Heading>
      </VStack>
    </Card>
  );
}
