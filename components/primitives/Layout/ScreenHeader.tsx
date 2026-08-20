import { ReactNode } from "react";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 3) + "...";
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
      <Center className="absolute inset-0">
        <Heading size="lg">{title && truncateText(title, 20)}</Heading>
      </Center>
      <Box />
      {rightComponent}
    </HStack>
  );
}
