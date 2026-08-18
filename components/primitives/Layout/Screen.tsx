import { ReactNode, useState } from "react";
import { LayoutChangeEvent, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ScreenProps {
  isLoading?: boolean;
  isError?: boolean;
  overlayComponent?: ReactNode;
  portalComponent?: ReactNode;
  headerComponent?: ReactNode;
  contentComponent: ReactNode;
  errorComponent?: ReactNode;
  loadingComponent?: ReactNode;
  footerComponent?: ReactNode;
  space?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  scrollable?: boolean;
}

export function Screen({
  isLoading,
  isError,
  space = "2xl",
  headerComponent,
  overlayComponent,
  contentComponent,
  errorComponent,
  loadingComponent,
  footerComponent,
  scrollable,
}: ScreenProps) {
  useThemeColors();

  const canRenderContent = !isLoading && !isError;

  const contentStyle = {
    flex: scrollable ? undefined : 1,
  };

  const content = (
    <SafeAreaView
      edges={headerComponent ? ["left", "right", "bottom"] : undefined}
      style={contentStyle}
    >
      <VStack className="px-8 py-6" style={contentStyle} space={space}>
        {canRenderContent && contentComponent}
        {isLoading && loadingComponent}
        {isError && <Center>{errorComponent}</Center>}
        {footerComponent}
      </VStack>
    </SafeAreaView>
  );

  return (
    <Box className="flex-1 bg-background">
      {headerComponent && (
        <Box className="z-10 -mb-4 pb-4 pt-6">
          <SafeAreaView edges={["top", "left", "right"]}>
            <VStack className="px-8" space={space}>
              {headerComponent}
            </VStack>
          </SafeAreaView>

          <Box className="absolute inset-0 bg-background -z-1" />
        </Box>
      )}

      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView>
      ) : (
        content
      )}

      {overlayComponent && (
        <Box className="absolute inset-0">{overlayComponent}</Box>
      )}
    </Box>
  );
}
