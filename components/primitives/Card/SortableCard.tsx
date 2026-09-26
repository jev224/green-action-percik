import { GripVertical, Trash } from "lucide-react-native";
import { Pressable } from "react-native";
import { config } from "@/components/animation/config";
import type {
	SemanticColor,
	SurfaceVariant,
} from "@/components/styles/buildColorsVariants";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { nativeOnlyProps } from "@/utils";
import { IconButton } from "../Button/IconButton";
import { SurfaceCard } from "./SurfaceCard";

interface SortableCardProps {
	title: string;
	color?: SemanticColor;
	variant?: SurfaceVariant;
	description?: string;
	onPress?: () => void;
	onDelete?: () => void;
}

export const SortableCard = ({
	title,
	description,
	color,
	variant,
	onPress,
	onDelete,
}: SortableCardProps) => {
	return (
		<Pressable
			onPress={onPress}
			delayHoverIn={0}
			unstable_pressDelay={config.pressableDelay}
		>
			<SurfaceCard
				color={color}
				variant={variant}
				className="flex-row items-center px-4 gap-4 rounded-md"
			>
				{(styles) => (
					<>
						<Icon
							className={styles.icon({ className: "opacity-80" })}
							as={GripVertical}
						/>
						<VStack className="flex-1">
							<Heading className={styles.text()} size="sm">
								{title}
							</Heading>
							{description && (
								<Text
									className={styles.text()}
									{...nativeOnlyProps({
										numberOfLines: 1,
									})}
								>
									{description}
								</Text>
							)}
						</VStack>

						<IconButton
							icon={Trash}
							size="sm"
							variant="outline"
							onPress={onDelete}
							className="rounded-sm "
						/>
					</>
				)}
			</SurfaceCard>
		</Pressable>
	);
};
