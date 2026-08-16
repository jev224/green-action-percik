// components/primitives/List/ListSection.tsx
// Was lists/ListSection.tsx. Already clean — moved as-is.

import { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

interface ListSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ListSection({ title, children, className }: ListSectionProps) {
  return (
    <VStack className={className} space="lg">
      <Heading size="lg" numberOfLines={2}>
        {title}
      </Heading>
      {children}
    </VStack>
  );
}
