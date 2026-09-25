import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { ScrollView } from "react-native";
import { EaseView } from "react-native-ease";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	FadeOut,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { config } from "@/components/animation/config";
import { AnimationConfig } from "@/components/animation/presets";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";

interface FilterChipsProps {
	options: string[];
	selected: string | null;
	onSelect: (option: string | null) => void;
	allLabel?: string;
}

export function FilterChips({
	options,
	selected,
	onSelect,
	allLabel = "Semua",
}: FilterChipsProps) {
	if (options.length === 0) return null;

	const nativeGesture = Gesture.Native()
		.disallowInterruption(true)
		.shouldCancelWhenOutside(false)
		.hitSlop({ top: 10, bottom: 10, left: 10, right: 10 });

	return (
		<GestureDetector gesture={nativeGesture}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				bounces={false}
				overScrollMode="never"
				style={{ overflow: "visible" }}
			>
				<Box className="flex-row gap-2">
					<Chip
						label={allLabel}
						isActive={selected === null}
						onPress={() => onSelect(null)}
					/>

					{options.map((option) => (
						<Chip
							key={option}
							label={option}
							isActive={selected === option}
							onPress={() => onSelect(option)}
						/>
					))}
				</Box>
			</ScrollView>
		</GestureDetector>
	);
}

function Chip({
	label,
	isActive,
	onPress,
}: {
	label: string;
	isActive: boolean;
	onPress: () => void;
}) {
	const { colors } = useThemeColors();
	const { isPressing, bind } = usePressFeedback(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withSpring(isPressing ? 0.9 : 1, AnimationConfig.spring.bouncy),
			},
		],
	}));

	return (
		<Pressable
			unstable_pressDelay={config.pressableDelay}
			onPress={onPress}
			onPressIn={bind.onPressIn}
			onPressOut={bind.onPressOut}
		>
			<Animated.View
				exiting={FadeOut.duration(120)}
				style={animatedStyle}
				className={cn(
					"px-4 py-2.5 rounded-lg border overflow-hidden",
					"bg-muted border-border",
				)}
			>
				<EaseView
					animate={{
						opacity: isActive ? 1 : 0,
					}}
					transition={{
						type: "timing",
						duration: 120,
					}}
					style={{
						backgroundColor: colors.primary,
						position: "absolute",
						inset: 0,
						zIndex: -1,
					}}
				/>

				<Text
					className={
						isActive
							? "text-primary-foreground font-bold"
							: "text-muted-foreground"
					}
				>
					{label}
				</Text>
			</Animated.View>
		</Pressable>
	);
}
