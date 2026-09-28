import { type ColorValue, View } from "react-native";
import { EaseView } from "react-native-ease";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { DEVICE_TIER, useReduceMotion } from "@/lib/deviceTier";

type GlowOrbProps = {
	color?: ColorValue;
	size?: number;
	isBreathingEnabled?: boolean;
	breathDurationMs?: number;
	breathDelayMs?: number;
	minOpacity?: number;
	maxOpacity?: number;
	minScale?: number;
	maxScale?: number;
};

export function GlowOrb({
	color,
	size = 300,
	isBreathingEnabled = true,
	breathDurationMs = 2400,
	breathDelayMs = 0,
	minOpacity = 0.5,
	maxOpacity = 1,
	minScale = 0.92,
	maxScale = 1,
}: GlowOrbProps) {
	const reduceMotion = useReduceMotion();

	if (DEVICE_TIER === "low") return null;

	const canAnimate =
		isBreathingEnabled && !reduceMotion && DEVICE_TIER === "high";

	const orb = (
		<Svg width={size} height={size} viewBox="0 0 100 100">
			<Defs>
				<RadialGradient id="glow" cx="50%" cy="50%" r="50%">
					<Stop offset="0%" stopColor={color} stopOpacity={0.55} />
					<Stop offset="60%" stopColor={color} stopOpacity={0.25} />
					<Stop offset="100%" stopColor={color} stopOpacity={0} />
				</RadialGradient>
			</Defs>
			<Circle cx="50" cy="50" r="50" fill="url(#glow)" />
		</Svg>
	);

	return (
		<View
			className="absolute -inset-8 -z-10"
			style={{ alignItems: "center", justifyContent: "center" }}
			pointerEvents="none"
		>
			{canAnimate ? (
				<EaseView
					initialAnimate={{ scale: maxScale, opacity: maxOpacity }}
					animate={{ scale: minScale, opacity: minOpacity }}
					transition={{
						transform: {
							type: "timing",
							loop: "reverse",
							duration: breathDurationMs,
							delay: breathDelayMs,
							easing: "easeInOut",
						},
					}}
				>
					{orb}
				</EaseView>
			) : (
				<View style={{ opacity: (minOpacity + maxOpacity) / 2 }}>{orb}</View>
			)}
		</View>
	);
}
