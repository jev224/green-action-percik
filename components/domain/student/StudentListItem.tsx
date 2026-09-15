import { EaseView } from "react-native-ease";
import Animated, {
	interpolate,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { config } from "@/components/animation/config";
import { AnimationConfig } from "@/components/animation/presets";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { StudentData } from "./types";

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface StudentListItemProps {
	selected?: boolean;
	noPressAnimation?: boolean;
	student: StudentData;
	onPress?: (student: StudentData) => void;
	className?: string;
}

export function StudentListItem({
	selected,
	noPressAnimation,
	student,
	onPress,
	className,
}: StudentListItemProps) {
	const { name, grade, point, photo_url } = student;

	const { colors } = useThemeColors();
	const { bind, isPressing } = usePressFeedback(0.96);

	const animatedStyle = useAnimatedStyle(() => {
		const paddingVertical = interpolate(isPressing ? 1 : 0, [0, 1], [16, 24]);
		const paddingHorizontal = interpolate(
			isPressing || selected ? 1 : 0,
			[0, 1],
			[0, 14],
		);

		return {
			paddingVertical: noPressAnimation
				? 12
				: withSpring(paddingVertical, AnimationConfig.spring.snappy),

			paddingHorizontal: withSpring(
				paddingHorizontal,
				AnimationConfig.spring.snappy,
			),

			transform: [
				{
					scale: withSpring(
						isPressing ? 0.97 : 1,
						AnimationConfig.spring.snappy,
					),
				},
			],
		};
	});

	return (
		<Pressable
			disabled={!onPress}
			onPress={() => onPress?.(student)}
			onPressIn={bind.onPressIn}
			onPressOut={bind.onPressOut}
			delayHoverIn={0}
			unstable_pressDelay={config.pressableDelay}
			className={className}
		>
			<AnimatedBox
				style={animatedStyle}
				className={
					"rounded-lg overflow-hidden h-24 items-center justify-center"
				}
			>
				<Box className="absolute -right-4 -left-4 top-0 bottom-0">
					<EaseView
						animate={{
							opacity: isPressing ? 0.2 : 0,
						}}
						transition={{
							type: "timing",
							duration: 100,
						}}
						style={{
							position: "absolute",
							inset: 0,
							backgroundColor: colors.foreground,
						}}
					/>

					<EaseView
						animate={{
							opacity: selected ? 1.0 : 0,
						}}
						transition={{
							type: "timing",
							duration: 100,
						}}
						style={{
							position: "absolute",
							inset: 0,
							backgroundColor: selected ? colors.primary : "transparent",
						}}
					/>
				</Box>

				<Box className="flex-row items-center gap-4">
					<UserAvatar
						selected={selected}
						name={name}
						size="sm"
						imageSource={photo_url ? { uri: photo_url } : undefined}
					/>

					<Box className="flex-1">
						<Heading numberOfLines={1}>{name}</Heading>
						{grade && <Text>{grade}</Text>}
					</Box>

					{point != null && (
						<Heading className="text-primary font-semibold" size="lg">
							{point} Poin
						</Heading>
					)}
				</Box>
			</AnimatedBox>
		</Pressable>
	);
}
