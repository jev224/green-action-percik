import React from "react";
import { type ColorValue, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DEVICE_TIER } from "@/lib/deviceTier";
import {
	ACCENT_ARRANGEMENTS,
	CLUSTER_ARRANGEMENTS,
	type LeafPattern,
	SHADOW_CONFIG,
} from "./leafArrangements";

interface LeafDecorationProps {
	/** cluster = several overlapping leaves, accent = single leaf */
	variant?: "cluster" | "accent";

	pattern?: LeafPattern;

	color?: ColorValue;

	/** Shadow style applied to each leaf */
	shadow?: keyof typeof SHADOW_CONFIG;
}

export const LeafDecoration = React.memo(function LeafDecoration({
	variant = "cluster",
	pattern = "1",
	color = "primary",
	shadow = "none",
}: LeafDecorationProps) {
	const { colors } = useThemeColors();

	const arrangements =
		variant === "cluster" ? CLUSTER_ARRANGEMENTS : ACCENT_ARRANGEMENTS;

	const effectiveShadow = DEVICE_TIER === "low" ? "none" : shadow;

	const placements = arrangements[pattern];

	return (
		<>
			{placements.map(
				({ asset: Asset, className, size, opacity, colorKey }, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Static decorative elements
					<View key={i} className={className}>
						<Asset
							style={SHADOW_CONFIG[effectiveShadow]}
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
});
