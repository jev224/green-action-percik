import { View, ColorValue } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

import {
  CLUSTER_ARRANGEMENTS,
  ACCENT_ARRANGEMENTS,
  SHADOW_CONFIG,
  LeafPattern,
} from "./leafArrangements";

interface LeafDecorationProps {
  /** cluster = several overlapping leaves, accent = single leaf */
  variant?: "cluster" | "accent";

  pattern?: LeafPattern;

  color?: ColorValue;

  /** Shadow style applied to each leaf */
  shadow?: keyof typeof SHADOW_CONFIG;
}

export function LeafDecoration({
  variant = "cluster",
  pattern = "1",
  color = "primary",
  shadow = "none",
}: LeafDecorationProps) {
  const colors = useThemeColors();

  const arrangements =
    variant === "cluster" ? CLUSTER_ARRANGEMENTS : ACCENT_ARRANGEMENTS;

  const placements = arrangements[pattern];

  return (
    <>
      {placements.map(
        ({ asset: Asset, className, size, opacity, colorKey }, i) => (
          <View key={i} className={className}>
            <Asset
              style={SHADOW_CONFIG[shadow]}
              width={size}
              height={size}
              color={colorKey ? colors[colorKey] : color}
              opacity={opacity}
            />
          </View>
        ),
      )}
    </>
  );
}
