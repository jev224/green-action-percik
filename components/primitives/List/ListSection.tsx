import { ComponentProps, ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

interface ListSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  size?: ComponentProps<typeof Heading>["size"];
  space?: ComponentProps<typeof VStack>["space"];
}

export function ListSection({
  title,
  children,
  className,
  size = "lg",
  space = "lg",
}: ListSectionProps) {
  return (
    <VStack className={className} space={space}>
      <Heading size={size} numberOfLines={2}>
        {title}
      </Heading>
      {children}
    </VStack>
  );
}
