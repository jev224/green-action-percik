import type React from "react";
import { useEffect, useId, useState } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";

type GradientHeadingProps = {
	children: React.ReactNode;
	colors?: readonly [string, string, ...string[]];
	duration?: number;
	className?: string;
};

export function GradientHeading({
	children,
	duration = 1800,
	className,
}: GradientHeadingProps) {
	const { colors } = useThemeColors();

	const gradientColors = [
		colors.info,
		colors.ring,
		colors.success,
		colors.ring,
		colors.info,
	] as const;

	const animationName = useId().replace(/[:]/g, "");

	// Toggling a CSS class/animation-play-state isn't needed here — a plain
	// looping CSS keyframe animation handles this declaratively on web,
	// unlike native where we manually flip translateX with EaseView.
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);

	return (
		<span
			className={className}
			style={{
				display: "inline-block",
				fontSize: 42,
				fontWeight: "bold",
				backgroundImage: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
				backgroundSize: "200% 100%",
				backgroundClip: "text",
				WebkitBackgroundClip: "text",
				color: "transparent",
				WebkitTextFillColor: "transparent",
				animation: isMounted
					? `${animationName} ${duration}ms linear infinite alternate`
					: undefined,
			}}
		>
			{children}

			<style>{`
				@keyframes ${animationName} {
					from { background-position: 0% 0%; }
					to { background-position: 100% 0%; }
				}
			`}</style>
		</span>
	);
}
