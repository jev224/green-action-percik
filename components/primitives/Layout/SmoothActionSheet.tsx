import { type ReactNode, useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { EaseView } from "react-native-ease";
import {
	Gesture,
	GestureDetector,
	ScrollView,
} from "react-native-gesture-handler";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { cnBase } from "tailwind-variants";

import { AnimatedPressable } from "@/components/animation/animatedComponent";

import { AnimationConfig } from "@/components/animation/presets";
import { Box } from "@/components/ui/box";
import { SelectContent, SelectPortal } from "@/components/ui/select";
import {
	Actionsheet,
	ActionsheetContent,
} from "@/components/ui/select/select-actionsheet";
import { VStack } from "@/components/ui/vstack";

interface SmoothActionSheetProp {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	fullHeight?: boolean;
	scrollable?: boolean;
	selectPortal?: boolean;
}
export const SmoothActionSheet = ({
	isOpen,
	onClose,
	children,
	fullHeight,
	selectPortal,
	scrollable = true,
}: SmoothActionSheetProp) => {
	const { height } = useWindowDimensions();

	const [isOpenInternal, setIsOpenInternal] = useState(false);

	const translateY = useSharedValue(0);
	const opacity = useSharedValue(0);
	const isAnimating = useSharedValue(false);

	const menuAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const backdropAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.get(),
	}));

	const handleOpen = () => {
		if (!isAnimating.get()) {
			opacity.set(0);
			translateY.set(height);
		}

		isAnimating.set(true);

		setIsOpenInternal(true);

		// Let the newly-mounted content commit + do its first layout pass
		// (still off-screen / transparent) before the spring starts, so the
		// mount cost doesn't steal frames from the animation.

		requestAnimationFrame(() => {
			opacity.set(withSpring(1, AnimationConfig.timing.smoothEnter));

			translateY.set(
				withSpring(0, AnimationConfig.spring.heavy, (finished) => {
					"worklet";
					if (finished) isAnimating.set(false);
				}),
			);
		});
	};

	const handleClose = () => {
		isAnimating.set(true);

		opacity.set(withTiming(0, AnimationConfig.timing.fastExit));

		translateY.set(
			withTiming(height, AnimationConfig.timing.smoothExit, (finished) => {
				"worklet";

				if (finished) {
					scheduleOnRN(setIsOpenInternal, false);
					isAnimating.set(false);
				}
			}),
		);
	};

	useEffect(() => {
		if (isOpen) {
			handleOpen();
		} else {
			handleClose();
		}
	}, [isOpen]);

	const [isDragging, setIsDragging] = useState(false);

	const OVERSCROLL = 100;
	const RESISTANCE = 0.25;

	const panGesture = Gesture.Pan()
		.onBegin(() => {
			scheduleOnRN(setIsDragging, true);
		})
		.onUpdate((event) => {
			const y = event.translationY;

			if (y > OVERSCROLL) {
				// Down overscroll
				translateY.value = OVERSCROLL + (y - OVERSCROLL) * RESISTANCE;
			} else if (y < -OVERSCROLL) {
				// Up overscroll
				translateY.value = -OVERSCROLL + (y + OVERSCROLL) * RESISTANCE;
			} else {
				// Normal movement
				translateY.value = y;
			}
		})
		.onEnd((event) => {
			scheduleOnRN(setIsDragging, false);

			const shouldClose = event.translationY > 100 || event.velocityY > 800;

			if (shouldClose) {
				scheduleOnRN(onClose);
				return;
			}

			translateY.value = withSpring(0, AnimationConfig.spring.snappy);
		});

	const renderContent = (
		<>
			<Box className="absolute inset-0 -bottom-70 rounded-xl bg-background" />

			<Box className="w-full p-2 items-center justify-center z-20">
				<GestureDetector gesture={panGesture}>
					<Box className="absolute -top-6 -bottom-6 px-8 items-center justify-center">
						<EaseView animate={{ scale: isDragging ? 1.2 : 1 }}>
							<Box className="w-14 h-2 bg-foreground/70 rounded-full" />
						</EaseView>
					</Box>
				</GestureDetector>
			</Box>

			{scrollable ? (
				<ScrollView className="w-full mt-2" style={{ maxHeight: height - 200 }}>
					<VStack space="sm">{children}</VStack>
				</ScrollView>
			) : (
				<View className="flex-1 w-full l mt-2">
					<VStack space="sm">{children}</VStack>
				</View>
			)}
		</>
	);

	const renderActionSheetContent = (
		<>
			<AnimatedPressable
				className="absolute inset-0 bg-black/80"
				onPress={onClose}
				style={backdropAnimatedStyle}
			/>
			<AnimatedPressable
				onPress={onClose}
				style={menuAnimatedStyle}
				className="h-full"
			>
				{selectPortal ? (
					<SelectContent
						className={cnBase(
							"absolute bottom-0 left-[50%] right-0 -translate-x-[50%] p-3 bg-transparent max-w-180",
							fullHeight && "min-h-[85%]",
						)}
						initial={{ y: 0 }}
						animate={{ y: 0 }}
						exit={{ y: 0 }}
					>
						{renderContent}
					</SelectContent>
				) : (
					<ActionsheetContent
						className={cnBase(
							"absolute bottom-0 left-[50%] right-0 -translate-x-[50%] p-3 bg-transparent max-w-180",
							fullHeight && "min-h-[85%]",
						)}
						initial={{ y: 0 }}
						animate={{ y: 0 }}
						exit={{ y: 0 }}
					>
						{renderContent}
					</ActionsheetContent>
				)}
			</AnimatedPressable>
		</>
	);

	return selectPortal ? (
		<SelectPortal
			className="pb-6"
			isOpen={isOpenInternal}
			onClose={onClose}
			pointerEvents={isOpen ? "auto" : "box-none"}
		>
			{renderActionSheetContent}
		</SelectPortal>
	) : (
		<Actionsheet
			className="pb-6"
			isOpen={isOpenInternal}
			onClose={onClose}
			pointerEvents={isOpen ? "auto" : "box-none"}
		>
			{renderActionSheetContent}
		</Actionsheet>
	);
};
