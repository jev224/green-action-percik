import { View } from "react-native";

import Animated, {
	Extrapolation,
	interpolate,
	type SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";

interface PaginationDotsProps {
	length: number;
	progress: SharedValue<number>;
	dotSize?: number;
	activeDotWidth?: number;
	activeDotHeight?: number;
}

export function PaginationDots({
	length,
	progress,
	dotSize = 8,
	activeDotWidth = 32,
	activeDotHeight = 12,
}: PaginationDotsProps) {
	return (
		<View
			className="w-full flex-row justify-center items-center gap-1.5"
			style={{ height: activeDotHeight }}
		>
			{Array.from({ length }).map((_, index) => (
				<Dot
					// biome-ignore lint/suspicious/noArrayIndexKey: Pagination dots are static UI elements identified by their index
					key={index}
					index={index}
					length={length}
					progress={progress}
					dotSize={dotSize}
					activeDotWidth={activeDotWidth}
					activeDotHeight={activeDotHeight}
				/>
			))}
		</View>
	);
}

interface PaginationDotProps {
	index: number;
	length: number;
	progress: SharedValue<number>;
	dotSize: number;
	activeDotWidth: number;
	activeDotHeight: number;
}

export function Dot({
	index,
	length,
	progress,
	dotSize,
	activeDotWidth,
	activeDotHeight,
}: PaginationDotProps) {
	const animatedStyle = useAnimatedStyle(() => {
		const diff = Math.min(
			Math.abs(progress.value - index),
			Math.abs(progress.value - index - length),
			Math.abs(progress.value - index + length),
		);

		const width = interpolate(
			diff,
			[0, 1],
			[activeDotWidth, dotSize],
			Extrapolation.CLAMP,
		);

		const height = interpolate(
			diff,
			[0, 1],
			[activeDotHeight, dotSize],
			Extrapolation.CLAMP,
		);

		const opacity = interpolate(diff, [0, 1], [1, 0.5], Extrapolation.CLAMP);

		return { width, height, opacity };
	});

	return (
		<Animated.View
			className="bg-foreground size-2 rounded-full"
			style={animatedStyle}
		/>
	);
}
