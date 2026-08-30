import { View, ColorValue, useColorScheme } from "react-native";

import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { useThemeColors } from "@/hooks/useThemeColors";

type GlowVariant = "corner" | "edges";

interface GlowDecorationProps {
  variant?: GlowVariant;
  /** corner: outer stop color. edges: [left color, right color]. */
  color?: ColorValue;
  /** corner only: inner stop color (defaults to `color`) */
  colorForeground?: ColorValue;
  /** edges only: overrides the pair independently */
  edgeColors?: [ColorValue, ColorValue];
  className?: string;
}

export function GlowDecoration({
  variant = "corner",
  color,
  colorForeground,
  edgeColors,
  className,
}: GlowDecorationProps) {
  const colors = useThemeColors();

  if (variant === "edges") {
    const [leftColor, rightColor] = edgeColors ?? [
      colors.primary,
      colors.accent,
    ];
    return (
      <View
        className={className ?? "absolute inset-0 rounded-xl overflow-hidden"}
      >
        <EdgeGlow side="left" color={leftColor} />
        <EdgeGlow side="right" color={rightColor} />
      </View>
    );
  }

  const outer = color ?? colors.garden;
  const inner = colorForeground ?? outer;

  return (
    <View
      className={
        className ?? "absolute -top-[15%] -right-[20%] w-[175%] aspect-square"
      }
    >
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="cornerGlow">
            <Stop offset="0" stopColor="transparent" stopOpacity={0} />
            <Stop offset="0.6" stopColor={inner} stopOpacity={0.125} />
            <Stop offset="1" stopColor={outer} stopOpacity={0.15} />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="50%" r="50%" fill="url(#cornerGlow)" />
      </Svg>
    </View>
  );
}

function EdgeGlow({
  side,
  color,
}: {
  side: "left" | "right";
  color: ColorValue;
}) {
  const isDark = useColorScheme() === "dark";

  const positionClass = side === "left" ? "-left-full" : "-right-full";
  return (
    <View className={`absolute top-0 bottom-0 ${positionClass} w-[200%]`}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={`edgeGlow-${side}`}>
            <Stop
              offset="1"
              stopColor={isDark ? "black" : "white"}
              stopOpacity={0}
            />
            <Stop offset="0" stopColor={color} stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="50%" r="50%" fill={`url(#edgeGlow-${side})`} />
      </Svg>
    </View>
  );
}
