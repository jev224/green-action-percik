import { Children, isValidElement, type ReactNode, useCallback } from "react";
import { useWindowDimensions, View } from "react-native";
import { interpolate, useSharedValue } from "react-native-reanimated";

import {
	Carousel,
	type CarouselItemAnimation,
	type CarouselRenderItemInfo,
} from "react-native-reanimated-carousel";
import { AnimationConfig } from "@/components/animation/presets";
import { VStack } from "@/components/ui/vstack";
import { PaginationDots } from "../Feedback/PaginationDot";

const OFFSET_X = 100;

interface HomeCarouselProps {
	innerDecoration?: ReactNode;
	outerDecoration?: ReactNode;
	children: ReactNode;
	height?: number;
}

export const HomeCarousel = ({
	innerDecoration,
	outerDecoration,
	children,
	height = 200,
}: HomeCarouselProps) => {
	const { width: screenWidth } = useWindowDimensions();

	const itemAnimation: CarouselItemAnimation = useCallback(
		(relativeProgress) => {
			"worklet";

			return {
				opacity: interpolate(relativeProgress, [-1, 0, 1], [0, 1, 0]),
				zIndex: 100 - Math.floor(Math.abs(relativeProgress) * 10),
				transform: [
					{ perspective: 800 },
					{
						translateX: interpolate(
							relativeProgress,
							[-1, 0, 1],
							[-screenWidth + OFFSET_X, 0, screenWidth - OFFSET_X],
						),
					},

					{
						rotateY: `${interpolate(relativeProgress, [-1, 0, 1], [24, 0, -24])}deg`,
					},
					{ scale: interpolate(relativeProgress, [-1, 0, 1], [0.7, 1, 0.7]) },
				],
			};
		},
		[screenWidth],
	);

	const items = Children.toArray(children).filter(isValidElement);

	const renderItem = useCallback(
		({ item }: CarouselRenderItemInfo<(typeof items)[number]>) => (
			<View className="flex-1 w-full">
				{innerDecoration && (
					<View className="absolute inset-0">{innerDecoration}</View>
				)}
				{item}
			</View>
		),
		[],
	);

	const carouselProgress = useSharedValue(0);

	return (
		<VStack space="2xl">
			<Carousel
				data={items}
				scrollEnabled={items.length > 1}
				progress={carouselProgress}
				animation={{ type: "spring", ...AnimationConfig.spring.heavy }}
				itemAnimation={itemAnimation}
				style={{
					overflow: "visible",
					maxHeight: height,
					height,
					width: "100%",
				}}
				contentContainerStyle={{ overflow: "visible" }}
				renderItem={renderItem}
			/>

			{items.length > 1 && (
				<PaginationDots length={items.length} progress={carouselProgress} />
			)}

			{outerDecoration}
		</VStack>
	);
};
