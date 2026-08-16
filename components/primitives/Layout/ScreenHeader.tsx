// components/primitives/Layout/ScreenHeader.tsx
// Was headers/ScreenHeading.tsx. Moved into Layout/ since it's a screen
// chrome piece, not a data-driven "header" like ProfileHeader/Greeting —
// renamed to ScreenHeader to disambiguate from those two.

import { ReactNode } from "react";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";

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
        <Heading size="lg">{title}</Heading>
      </Center>
      {rightComponent}
    </HStack>
  );
}
