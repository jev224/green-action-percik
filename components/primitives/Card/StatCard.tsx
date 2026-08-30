import { ComponentProps, ReactNode } from "react";
import { ImageSourcePropType, Pressable, View } from "react-native";

import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { tv, type VariantProps } from "tailwind-variants";

import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";

import {
  AnimatedBox,
  AnimatedSurfaceCard,
} from "@/components/animation/animatedComponent";

import {
  SemanticColor,
  SurfaceVariant,
} from "@/components/styles/buildColorsVariants";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { config } from "@/components/animation/config";

const statCardStyle = tv({
  slots: {
    card: "flex-row items-center shadow-none overflow-hidden",
    thumbnail: "rounded-sm overflow-hidden",
    icon: "w-full h-full",
    title: "opacity-80",
    stats: "",
    content: "",
  },
  variants: {
    size: {
      default: {
        card: "flex-col gap-3 shadow-none px-1",
        title: "text-md font-medium opacity-80",
        stats: "text-xl",
        thumbnail: "size-8 overflow-visible",
        content: "items-center flex-col-reverse",
      },
      md: {
        card: "min-h-24 px-6",
        title: "text-lg font-bold opacity-80",
        stats: "text-3xl",
        icon: "opacity-90 dark:opacity-100",
        thumbnail: "absolute -right-2 -bottom-4 size-22",
        content: "flex-1",
      },
      lg: {
        card: "min-h-38 p-6 pl-8",
        title: "text-xl font-bold w-[70%]",
        stats: "text-6xl w-[70%]",
        icon: "w-24 h-24 opacity-90 dark:opacity-100",
        thumbnail:
          "absolute right-4 top-0 bottom-0 w-[50%] items-center justify-center",
        content: "flex-1 gap-2",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
  compoundVariants: [
    // icon opacity tweaks per size, same as the original
    { size: "md", variant: "outline", class: { icon: "opacity-80" } },
    {
      size: "lg",
      variant: "outline",
      class: { icon: "opacity-90 dark:opacity-100" },
    },
  ],
});

type StatCardVariants = VariantProps<typeof statCardStyle>;
export type StatCardSize = StatCardVariants["size"];
interface StatCardProps {
  title: string;
  stats: string | number;
  imageSource?: ImageSourcePropType;
  icon?: ComponentProps<typeof Icon>["as"];
  size?: StatCardSize;
  color?: SemanticColor;
  variant?: SurfaceVariant;
  className?: string;
  thumbnailRotation?: number;
  animation?: "fun" | "none";
  fill?: boolean;
  innerDecoration?: ReactNode;
  outerDecoration?: ReactNode;
}

export function StatCard({
  title,
  stats,
  imageSource,
  icon,
  size = "default",
  color = "primary",
  variant = "solid",
  thumbnailRotation = 0,
  animation = "none",
  fill,
  className,
  innerDecoration,
  outerDecoration,
}: StatCardProps) {
  // "variant" is now actually forwarded, so the compoundVariants above apply.
  const styles = statCardStyle({ size });

  const hasThumbnail = Boolean(imageSource || icon);
  const isInteractive = animation !== "none";

  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const progressValue = progress.get();

    const scale = interpolate(progressValue, [0, 1], [1, 1.03]);

    return {
      transform: [{ scale }],
    };
  });

  const thumbnailAnimatedStyle = useAnimatedStyle(() => {
    const progressValue = progress.get();

    const scale = interpolate(progressValue, [0, 1], [1, 1.1]);

    return {
      transform: [
        { scale },
        { rotateZ: `${rotation.get() + thumbnailRotation}deg` },
      ],
    };
  });

  const handlePress = () => {
    progress.set(
      withSequence(
        withSpring(1, { stiffness: 500, damping: 40 }),
        withSpring(0, { stiffness: 600, damping: 26 }),
      ),
    );

    rotation.set(
      withSpring(360, { stiffness: 500, damping: 40 }, (finished) => {
        if (finished) rotation.set(0);
      }),
    );
  };

  return (
    <View className={cn(fill && "flex-1")}>
      {outerDecoration && (
        <View className="absolute inset-0">{outerDecoration}</View>
      )}

      <AnimatedSurfaceCard
        color={color}
        variant={variant}
        className={styles.card({ className })}
        style={cardAnimatedStyle}
      >
        {(baseStyles) => (
          <>
            {innerDecoration && (
              <View className="absolute inset-0">{innerDecoration}</View>
            )}

            {/* Only mounts (and only captures touches) when there's actually
              something to animate — previously this always sat over the
              whole card, even with animation="none". */}
            {isInteractive && (
              <Pressable
                delayHoverIn={0}
                unstable_pressDelay={config.pressableDelay}
                className="absolute inset-0 z-20"
                onPress={handlePress}
              />
            )}

            {hasThumbnail && (
              <AnimatedBox
                className={styles.thumbnail()}
                style={thumbnailAnimatedStyle}
              >
                {imageSource ? (
                  <Image className="w-full h-full" source={imageSource} />
                ) : (
                  <Icon
                    as={icon}
                    className={baseStyles.icon({
                      className: styles.icon(),
                    })}
                  />
                )}
              </AnimatedBox>
            )}

            <VStack className={styles.content()}>
              <Heading
                className={baseStyles.text({
                  className: styles.title(),
                })}
                numberOfLines={1}
              >
                {title}
              </Heading>
              <Heading
                className={baseStyles.text({
                  className: styles.stats(),
                })}
                numberOfLines={1}
              >
                {stats}
              </Heading>
            </VStack>
          </>
        )}
      </AnimatedSurfaceCard>
    </View>
  );
}
