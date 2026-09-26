import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { nativeOnlyProps } from "@/utils";

interface ListSectionProps {
	title: string;
	children: ReactNode;
	className?: string;
	size?: ComponentProps<typeof Heading>["size"];
	space?: ComponentProps<typeof VStack>["space"];
	decoration?: ReactNode;
}

export function ListSection({
	title,
	children,
	className,
	size = "lg",
	space = "lg",
	decoration,
}: ListSectionProps) {
	return (
		<VStack className={className} space={space}>
			<HStack space="sm">
				<Heading size={size} {...nativeOnlyProps({ numberOfLines: 1 })}>
					{title}
				</Heading>

				{decoration && (
					<View className="self-stretch aspect-square">{decoration}</View>
				)}
			</HStack>
			{children}
		</VStack>
	);
}
