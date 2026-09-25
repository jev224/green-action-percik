import { cn } from "@gluestack-ui/utils/nativewind-utils";

import type { ComponentProps, ReactNode } from "react";
import { type ImageSourcePropType, Pressable, StyleSheet } from "react-native";
import { EaseView } from "react-native-ease";
import { tv, type VariantProps } from "tailwind-variants";
import { config } from "@/components/animation/config";
import { AnimationConfig } from "@/components/animation/presets";
import type {
	SemanticColor,
	SurfaceVariant,
} from "@/components/styles/buildColorsVariants";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { SurfaceCard } from "./SurfaceCard";

const actionTileStyle = tv({
	slots: {
		card: "shadow-md",
		thumbnail: "size-18",
		icon: "w-12 h-12",
		content: "flex-1 w-full",
		description: "leading-5 opacity-80",
		title: "",
	},
	variants: {
		size: {
			default: {
				thumbnail: "size-20 rounded-sm",
				icon: "w-8 h-8",
			},
			md: {
				thumbnail: "size-22",
			},
			lg: {
				thumbnail: "size-28",
			},
		},

		thumbnailPosition: {
			left: {
				card: "flex-row gap-4  pr-5",
			},
			right: {
				card: "flex-row-reverse gap-4 pl-5",
			},
			top: {
				card: "flex-col p-2 gap-2",
				thumbnail: "w-full rounded-md",
				content: "px-2 pb-1 flex-none",
			},
		},
	},

	compoundVariants: [
		/* thumbnail min-height when position="top", scaled by size */
		{
			size: "default",
			thumbnailPosition: "top",
			class: { thumbnail: "h-28" },
		},
		{
			size: "md",
			thumbnailPosition: "top",
			class: { thumbnail: "h-32" },
		},
		{
			size: "lg",
			thumbnailPosition: "top",
			class: { thumbnail: "h-48" },
		},

		/* Others */
		{
			variant: "solid",
			class: { icon: "dark:opacity-90" },
		},
	],

	defaultVariants: {
		thumbnailPosition: "left",
		size: "default",
	},
});

type ActionTileStyleProps = VariantProps<typeof actionTileStyle>;

interface ActionTileProps {
	title: string;
	description?: string;
	imageSource?: ImageSourcePropType;
	contentPosition?: "top" | "center";
	icon?: ComponentProps<typeof Icon>["as"];
	color?: SemanticColor;
	variant?: SurfaceVariant | "ghost";
	onPress?: () => void;
	className?: string;
	size?: ActionTileStyleProps["size"];
	thumbnailPosition?: ActionTileStyleProps["thumbnailPosition"];
	headerRightComponent?: ReactNode;
	bottomComponent?: ReactNode;
	innerDecoration?: ReactNode;
	outerDecoration?: ReactNode;
}

export function ActionTile({
	title,
	description,
	imageSource,
	icon,
	size,
	color = "neutral",
	variant = "outline",
	onPress,
	className,
	thumbnailPosition,
	contentPosition = "center",
	headerRightComponent,
	bottomComponent,
	innerDecoration,
	outerDecoration,
}: ActionTileProps) {
	const { bind, scaleAnimation, isPressing } = usePressFeedback(0.97);

	const styles = actionTileStyle({ size, thumbnailPosition });

	const hasThumbnail = Boolean(imageSource || icon);

	const body = (
		<SurfaceCard
			color={color}
			variant={variant === "ghost" ? "outline" : variant}
			className={styles.card({
				className: cn(
					className,
					variant === "ghost" &&
						"bg-transparent border-transparent p-1 overflow-visible shadow-none",
				),
			})}
		>
			{(baseStyles) => (
				<>
					{innerDecoration && (
						<Box className="absolute inset-0">{innerDecoration}</Box>
					)}

					{/* Thumbnail — only rendered when there's actually something to show */}
					{hasThumbnail && (
						<Box
							className={baseStyles.thumbnail({
								class: styles.thumbnail(),
							})}
						>
							<EaseView
								style={globalStyles.thumbnailContentWrapper}
								animate={{ scale: isPressing ? 1.2 : 1.0 }}
								transition={{
									transform: {
										type: "spring",
										...AnimationConfig.spring.snappy,
									},
								}}
							>
								{imageSource ? (
									<Image className="w-full h-full" source={imageSource} />
								) : (
									<Icon
										className={baseStyles.icon({ className: styles.icon() })}
										as={icon}
									/>
								)}
							</EaseView>
						</Box>
					)}

					{/* Content */}
					<VStack
						className={styles.content({
							className: cn(contentPosition === "top" && "self-start"),
						})}
						space="xs"
					>
						<HStack className="justify-between items-center">
							<Heading
								size="md"
								className={baseStyles.text({ className: styles.title() })}
								numberOfLines={thumbnailPosition === "top" ? 2 : 1}
							>
								{title}
							</Heading>

							{headerRightComponent}
						</HStack>

						{description && (
							<Text
								className={baseStyles.text({ className: styles.description() })}
								size="sm"
								numberOfLines={size === "lg" ? 3 : 2}
							>
								{description}
							</Text>
						)}

						{bottomComponent}
					</VStack>
				</>
			)}
		</SurfaceCard>
	);

	return (
		<EaseView
			animate={scaleAnimation}
			transition={{
				transform: { type: "spring", ...AnimationConfig.spring.bouncy },
			}}
		>
			{onPress && (
				<Pressable
					className="absolute inset-0 z-10"
					accessibilityRole="button"
					accessibilityLabel={title}
					delayHoverIn={0}
					unstable_pressDelay={config.pressableDelay}
					onPress={onPress}
					onPressIn={bind.onPressIn}
					onPressOut={bind.onPressOut}
				/>
			)}

			{body}

			{outerDecoration}
		</EaseView>
	);
}

const globalStyles = StyleSheet.create({
	thumbnailContentWrapper: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
});
