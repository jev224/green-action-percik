import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { CheckCheck } from "lucide-react-native";
import type { ImageSourcePropType } from "react-native";
import { EaseView } from "react-native-ease";
import {
	AvatarFallbackText,
	AvatarImage,
	Avatar as GSAvatar,
} from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";

import { useThemeColors } from "@/hooks/useThemeColors";

type AvatarSize = "sm" | "md" | "lg";

// Matches the 3 sizes actually used across the app: sm for list rows/
// greeting header, md/lg for the profile screen.
const SIZE_CLASSES: Record<AvatarSize, string> = {
	sm: "h-16 w-16",
	md: "h-24 w-24",
	lg: "h-32 w-32",
};

interface UserAvatarProps {
	name: string;
	imageSource?: ImageSourcePropType;
	size?: AvatarSize;
	className?: string;
	selected?: boolean;
}

export function UserAvatar({
	name,
	imageSource,
	size = "md",
	className,
	selected,
}: UserAvatarProps) {
	const { colors } = useThemeColors();

	return (
		<GSAvatar className={cn(SIZE_CLASSES[size], "overflow-hidden", className)}>
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
					justifyContent: "center",
					alignItems: "center",
					zIndex: 2,
					inset: 0,
					backgroundColor: selected ? colors.accent : "transparent",
				}}
			>
				<Icon as={CheckCheck} className="size-8 text-accent-foreground" />
			</EaseView>

			<AvatarFallbackText
				className={cn(
					"font-bold",
					size === "sm" && "text-2xl",
					size === "md" && "text-4xl",
					size === "lg" && "text-6xl",
				)}
			>
				{name}
			</AvatarFallbackText>

			{imageSource && <AvatarImage source={imageSource} />}
		</GSAvatar>
	);
}
