import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { EaseView } from "react-native-ease";

import { Heading } from "@/components/ui/heading";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useThemeColors } from "@/hooks/useThemeColors";

type GradientHeadingProps = {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  duration?: number;
  size?: React.ComponentProps<typeof Heading>["size"];
  className?: string;
};

export function GradientHeading({
  children,
  duration = 1800,
  size = "xl",
  className,
}: GradientHeadingProps) {
  const colors = useThemeColors();

  // const gradientColors = [
  //   colors.primary,
  //   colors.ring,
  //   colors.success,
  //   colors.ring,
  //   colors.primary,
  // ] as const;

  const gradientColors = [
    colors.info,
    colors.ring,
    colors.success,
    colors.ring,
    colors.info,
  ] as const;

  const [dims, setDims] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [toggled, setToggled] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDims({ width, height });
  };

  // Only start looping once we know the real size — avoids animating
  // against a stale/incorrect width.
  useEffect(() => {
    if (!dims) return;
    const id = setInterval(() => setToggled((p) => !p), duration);
    return () => clearInterval(id);
  }, [dims, duration]);

  return (
    <View>
      {/* Fallback, shown for one frame until we've measured the real heading size */}
      {!dims && (
        <Heading size={size} className={className} onLayout={onLayout}>
          {children}
        </Heading>
      )}

      {dims && (
        <MaskedView
          style={{ width: dims.width, height: dims.height }}
          maskElement={
            <Heading size={size} className={cn("bg-transparent", className)}>
              {children}
            </Heading>
          }
        >
          {/* Clips the oversized, moving gradient to the heading's exact bounds
              so text is never cut off or offset */}
          <View
            style={{
              width: dims.width,
              height: dims.height,
              overflow: "hidden",
            }}
          >
            <EaseView
              animate={{ translateX: toggled ? 0 : -dims.width }}
              transition={{ type: "timing", duration }}
              style={{ width: dims.width * 2, height: dims.height }}
            >
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: dims.width * 2, height: dims.height }}
              />
            </EaseView>
          </View>
        </MaskedView>
      )}
    </View>
  );
}
