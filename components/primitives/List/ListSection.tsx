import { ComponentProps, ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { LeafDecoration } from "@/components/decoration";
import { View } from "react-native";

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
        <Heading size={size} numberOfLines={2}>
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
