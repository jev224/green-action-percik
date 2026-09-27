import { memo } from "react";
import { EaseView } from "react-native-ease";
import { useResolveClassNames } from "uniwind";
import { config } from "@/components/animation/config";
import { EaseTranstionConfig } from "@/components/animation/presets";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";
import { nativeOnlyProps } from "@/utils";
import type { StudentData } from "./types";

interface StudentListItemProps {
	selected?: boolean;
	student: StudentData;
	onPress?: (student: StudentData) => void;
	className?: string;
	noOffset?: boolean;
}

const WEBKIT_STYLE_KEYS = [
	"-webkit-text-fill-color",
	"-webkit-text-stroke-color",
	"-webkit-text-stroke-width",
	"-webkit-appearance",
	"-webkit-tap-highlight-color",
] as const;

const omitWebkitStyle = <T extends object>(style: T): T => {
	for (const key of WEBKIT_STYLE_KEYS) {
		delete style[key as keyof T];
	}
	return style;
};

export const StudentListItem = memo(function StudentListItem({
	selected = false,
	student,
	onPress,
	className,
	noOffset,
}: StudentListItemProps) {
	const { name, grade, point, photoUrl } = student;

	const containerStyle = omitWebkitStyle(
		useResolveClassNames(
			`h-24 items-center justify-center rounded-lg ${
				noOffset ? "" : "-ml-4 -mr-4"
			}`,
		),
	);

	const selectedBackgroundStyle = omitWebkitStyle(
		useResolveClassNames("absolute inset-0 rounded-lg bg-primary"),
	);

	const { colors } = useThemeColors();
	const { bind, isPressing } = usePressFeedback(0.96);

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
			<EaseView
				animate={{
					backgroundColor: isPressing ? colors.border : "transparent",
					scale: isPressing ? (noOffset ? 0.97 : 0.9) : 1,
				}}
				transition={{
					backgroundColor: { type: "timing", duration: 200 },
					transform: { type: "spring", ...EaseTranstionConfig.spring.snappy },
				}}
				style={containerStyle}
			>
				<EaseView
					animate={{
						opacity: selected ? 1.0 : 0,
					}}
					transition={{
						type: "timing",
						duration: 100,
					}}
					style={selectedBackgroundStyle}
				/>

				{noOffset ? (
					<Box className="flex-row items-center w-full">
						<EaseView
							style={{ flex: 1 }}
							animate={{ translateX: isPressing || selected ? 14 : 0 }}
							transition={{
								type: "spring",
								...EaseTranstionConfig.spring.snappy,
							}}
						>
							<HStack space="md" className="items-center">
								<UserAvatar
									selected={selected}
									name={name}
									size="sm"
									imageSource={photoUrl ? { uri: photoUrl } : undefined}
								/>

								<Box className="flex-1 w-[80%]">
									<Heading
										className="web:truncate"
										{...nativeOnlyProps({
											numberOfLines: 1,
										})}
									>
										{name}
									</Heading>
									{grade && <Text className="web:truncate">{grade}</Text>}
								</Box>
							</HStack>
						</EaseView>

						{point !== null && (
							<EaseView
								animate={{ translateX: isPressing || selected ? -14 : 0 }}
								transition={{
									type: "spring",
									...EaseTranstionConfig.spring.snappy,
								}}
							>
								<Heading
									className="text-primary font-semibold web:truncate"
									size="lg"
									{...nativeOnlyProps({
										numberOfLines: 1,
									})}
								>
									{point} Poin
								</Heading>
							</EaseView>
						)}
					</Box>
				) : (
					<Box className="flex-row items-center px-4 gap-4 w-full">
						<UserAvatar
							selected={selected}
							name={name}
							size="sm"
							imageSource={photoUrl ? { uri: photoUrl } : undefined}
						/>

						<Box className="flex-1">
							<Heading
								className="web:truncate"
								{...nativeOnlyProps({
									numberOfLines: 1,
								})}
							>
								{name}
							</Heading>
							{grade && <Text className="web:truncate">{grade}</Text>}
						</Box>

						{point !== null && (
							<Heading
								className="text-primary font-semibold web:truncate"
								size="lg"
								{...nativeOnlyProps({
									numberOfLines: 1,
								})}
							>
								{point} Poin
							</Heading>
						)}
					</Box>
				)}
			</EaseView>
		</Pressable>
	);
});
