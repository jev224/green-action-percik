import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import { EaseView } from "react-native-ease";
import {
	Gesture,
	GestureDetector,
	ScrollView,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { cnBase } from "tailwind-variants";

import { AnimationConfig } from "@/components/animation/presets";
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

const OVERSCROLL = 100;
const RESISTANCE = 0.25;
const CLOSE_DISTANCE = 100;
const CLOSE_VELOCITY = 800;
const BACKDROP_OPACITY = 0.8;

export const SmoothActionSheet = ({
	isOpen,
	onClose,
	children,
	fullHeight,
	selectPortal,
	scrollable = true,
}: SmoothActionSheetProp) => {
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const requestClose = useCallback(() => onCloseRef.current(), []);

	const { height } = useWindowDimensions();

	const [isAnimating, setAnimating] = useState(false);
	const animationId = useRef(0);
	const isFirstRun = useRef(true);

	const translateY = useSharedValue(height);

	const sheetAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			if (!isOpen) return; // already at rest, nothing to animate
		}

		setAnimating(true);
		const id = ++animationId.current;

		const finalize = (finishedId: number) => {
			if (finishedId === animationId.current) setAnimating(false);
		};

		const onComplete = () => {
			"worklet";
			scheduleOnRN(finalize, id);
		};

		const raf = requestAnimationFrame(() =>
			translateY.set(
				isOpen
					? withSpring(0, AnimationConfig.spring.heavy, onComplete)
					: withTiming(height, AnimationConfig.timing.smoothExit, onComplete),
			),
		);

		return () => {
			cancelAnimationFrame(raf);
			animationId.current++;
		};
	}, [isOpen, height, translateY]);

	const panGesture = useMemo(
		() =>
			Gesture.Pan()

				.onUpdate((event) => {
					const y = event.translationY;

					if (y < -OVERSCROLL) {
						// Up overscroll
						translateY.value = -OVERSCROLL + (y + OVERSCROLL) * RESISTANCE;
					} else {
						// Normal movement
						translateY.value = y;
					}
				})
				.onEnd((event) => {
					const shouldClose =
						event.translationY > CLOSE_DISTANCE ||
						event.velocityY > CLOSE_VELOCITY;

					if (shouldClose) {
						scheduleOnRN(requestClose);
						return;
					}

					translateY.value = withSpring(0, {
						...AnimationConfig.spring.snappy,
						velocity: event.velocityY,
					});
				}),
		[requestClose, translateY],
	);

	const pointerStyle = {
		pointerEvents: isOpen ? "auto" : "none",
	} as const;

	const Portal = selectPortal ? SelectPortal : Actionsheet;
	const Content = selectPortal ? SelectContent : ActionsheetContent;

	return (
		<Portal
			className="pb-6"
			isOpen={isAnimating || isOpen}
			onClose={requestClose}
			style={pointerStyle}
		>
			<EaseView
				animate={{ opacity: isOpen ? BACKDROP_OPACITY : 0 }}
				style={{
					pointerEvents: "none",
					position: "absolute",
					inset: 0,
					backgroundColor: "black",
				}}
			/>

			<Animated.View className="h-full items-center" style={sheetAnimatedStyle}>
				<Pressable
					className="absolute inset-0"
					onPress={requestClose}
					accessible={false}
					accessibilityElementsHidden={!isOpen}
					importantForAccessibility={isOpen ? "auto" : "no-hide-descendants"}
					style={pointerStyle}
				/>

				<View
					accessibilityViewIsModal={isOpen}
					className="h-full w-full max-w-180"
				>
					<Pressable
						className="absolute inset-0"
						onPress={requestClose}
						accessible={false}
						accessibilityElementsHidden={!isOpen}
						importantForAccessibility={isOpen ? "auto" : "no-hide-descendants"}
						style={pointerStyle}
					/>

					<Content
						className={cnBase(
							"absolute bottom-0 left-0 right-0 p-3 bg-transparent max-h-[85%]",
							fullHeight && "min-h-[85%]",
						)}
						initial={{ y: 0 }}
						animate={{ y: 0 }}
						exit={{ y: 0 }}
					>
						<View className="absolute inset-0 -bottom-70 rounded-xl bg-background -z-10" />

						<GestureDetector gesture={panGesture}>
							<View
								className="w-full p-2 items-center justify-center z-20 web:outline-none web:focus-visible:scale-120"
								accessible={isOpen}
								accessibilityRole="button"
								accessibilityLabel="Close sheet"
								accessibilityActions={[{ name: "activate" }]}
								onAccessibilityAction={requestClose}
							>
								<View className="absolute -top-6 -bottom-6 px-8 items-center justify-center">
									<View className="w-14 h-2 bg-foreground/70 rounded-full" />
								</View>
							</View>
						</GestureDetector>

						{scrollable ? (
							<ScrollView className="flex-1 w-full mt-2">
								<VStack space="sm">{children}</VStack>
							</ScrollView>
						) : (
							<View className="flex-1 w-full mt-2">
								<VStack space="sm">{children}</VStack>
							</View>
						)}
					</Content>
				</View>
			</Animated.View>
		</Portal>
	);
};
