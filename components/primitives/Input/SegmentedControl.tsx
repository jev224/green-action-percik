import { cn } from "@gluestack-ui/utils/nativewind-utils";
import type { ComponentProps } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { AnimationConfig } from "@/components/animation/presets";
import { Icon } from "@/components/ui/icon";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";

export interface SegmentedControlOption<T extends string> {
	value: T;
	label: string;
	icon?: ComponentProps<typeof Icon>["as"];
}

interface SegmentedControlProps<T extends string> {
	options: SegmentedControlOption<T>[];
	value: T;
	onChange: (value: T) => void;
	className?: string;
}

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	className,
}: SegmentedControlProps<T>) {
	return (
		<View className={cn("flex-row w-full gap-3", className)}>
			{options.map((option, index) => (
				<SegmentedControlButton
					// biome-ignore lint/suspicious/noArrayIndexKey: Static UI Element
					key={index}
					option={option}
					value={value}
					onChange={onChange}
				/>
			))}
		</View>
	);
}

interface SegmentedControlButtonProps<T extends string> {
	option: SegmentedControlOption<T>;
	value: T;
	onChange: (value: T) => void;
}

function SegmentedControlButton<T extends string>({
	option,
	value,
	onChange,
}: SegmentedControlButtonProps<T>) {
	const isActive = option.value === value;

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
			onPress={() => onChange(option.value)}
			onPressIn={bind.onPressIn}
			onPressOut={bind.onPressOut}
			className="flex-1"
		>
			<Animated.View
				style={animatedStyle}
				className="items-center justify-center rounded-md py-4 px-4 border border-border overflow-hidden bg-muted"
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

				{option.icon && (
					<Icon
						as={option.icon}
						className={cn(
							"mb-2",
							isActive ? "text-primary-foreground" : "text-foreground",
						)}
					/>
				)}

				<RNText
					numberOfLines={1}
					className={cn(
						"font-bold text-base ",
						isActive ? "text-primary-foreground" : "text-foreground",
					)}
				>
					{option.label}
				</RNText>
			</Animated.View>
		</Pressable>
	);
}
