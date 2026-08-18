import { ComponentProps, ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

interface ListSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  size?: ComponentProps<typeof Heading>["size"];
}

export function ListSection({
  title,
  children,
  className,
  size = "lg",
}: ListSectionProps) {
  return (
    <VStack className={className} space="lg">
      <Heading size={size} numberOfLines={2}>
        {title}
      </Heading>
      {children}
    </VStack>
  );
}
