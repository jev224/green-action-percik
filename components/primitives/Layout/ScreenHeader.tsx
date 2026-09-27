import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";

export const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) return text;

	return `${text.slice(0, maxLength - 3)}...`;
};

interface ScreenHeaderProps {
	title?: string;
	leftComponent?: ReactNode;
	rightComponent?: ReactNode;
}

export function ScreenHeader({
	title,
	leftComponent,
	rightComponent,
}: ScreenHeaderProps) {
	return (
		<HStack className="w-full min-h-8 justify-between">
			{leftComponent}
			<Center className="absolute inset-0 -z-10">
				<Heading size="lg" className="web:truncate">
					{title && truncateText(title, 20)}
				</Heading>
			</Center>
			<Box />
			{rightComponent}
		</HStack>
	);
}
