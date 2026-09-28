import React from "react";
import { type ColorValue, View } from "react-native";

import Svg, {
	Circle,
	Defs,
	RadialGradient,
	Rect,
	Stop,
} from "react-native-svg";

import { useThemeColors } from "@/hooks/useThemeColors";
import { DEVICE_TIER } from "@/lib/deviceTier";

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

export const GlowDecoration = React.memo(function GlowDecoration({
	variant = "corner",
	color,
	colorForeground,
	edgeColors,
	className,
}: GlowDecorationProps) {
	const { colors } = useThemeColors();

	if (DEVICE_TIER === "low") return null;

	if (variant === "edges") {
		const [leftColor, rightColor] = edgeColors ?? [
			colors.primary,
			colors.accent,
		];

		return (
			<View
				className={className ?? "absolute inset-0 rounded-xl overflow-hidden"}
				pointerEvents="none"
			>
				<Svg width="100%" height="100%">
					<Defs>
						<RadialGradient id="edgeLeft" cx="0%" cy="50%" r="75%">
							<Stop offset="0" stopColor={leftColor} stopOpacity={0.2} />
							<Stop offset="1" stopColor={leftColor} stopOpacity={0} />
						</RadialGradient>
						<RadialGradient id="edgeRight" cx="100%" cy="50%" r="75%">
							<Stop offset="0" stopColor={rightColor} stopOpacity={0.2} />
							<Stop offset="1" stopColor={rightColor} stopOpacity={0} />
						</RadialGradient>
					</Defs>
					<Rect width="100%" height="100%" fill="url(#edgeLeft)" />
					<Rect width="100%" height="100%" fill="url(#edgeRight)" />
				</Svg>
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
			pointerEvents="none"
		>
			<Svg width="100%" height="100%">
				<Defs>
					<RadialGradient id="cornerGlow">
						<Stop offset="0" stopColor={inner} stopOpacity={0} />
						<Stop offset="0.6" stopColor={inner} stopOpacity={0.125} />
						<Stop offset="1" stopColor={outer} stopOpacity={0.15} />
					</RadialGradient>
				</Defs>
				<Circle cx="50%" cy="50%" r="50%" fill="url(#cornerGlow)" />
			</Svg>
		</View>
	);
});
