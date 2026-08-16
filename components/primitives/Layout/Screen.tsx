// components/primitives/Layout/Screen.tsx
// Was layout/ScreenContainer.tsx. Renamed to `Screen` — every screen file
// wraps its content in this, so "Screen" reads better at the call site
// than "ScreenContainer" repeated everywhere. Logic unchanged, it was
// already reasonable.
//
// DROPPED (dead props): the old file declared `canRefresh` and `onRefresh`
// in its props type but never wired up a RefreshControl anywhere in the
// JSX — they did nothing. Removed rather than carried forward as fake
// functionality. Pull-to-refresh is a real ~10-line addition if you need
// it (RefreshControl on the ScrollView) — ask and I'll wire it properly.

import { ReactNode } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { useThemeColors } from "@/hooks/useThemeColors";

const TOP_MARGIN = 24;

interface ScreenProps {
  isLoading?: boolean;
  isError?: boolean;
  overlayComponent?: ReactNode;
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
  const insets = useSafeAreaInsets();
  useThemeColors(); // kept: forces re-render on theme change for consumers relying on it

  const canRenderContent = !isLoading && !isError;

  const renderBody = (body: ReactNode) =>
    scrollable ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="overflow-visible"
      >
        <VStack space={space}>{body}</VStack>
      </ScrollView>
    ) : (
      <VStack className="flex-1" space={space}>
        {body}
      </VStack>
    );

  return (
    <Box className="flex-1 bg-background">
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top", "bottom", "left", "right"]}
      >
        <Box className="flex-1 px-8" style={{ marginTop: TOP_MARGIN }}>
          {overlayComponent && (
            <Box className="absolute inset-0 px-8">{overlayComponent}</Box>
          )}

          {headerComponent && (
            <Box className="z-10 mb-4">
              <VStack className="mb-6 z-20" space={space}>
                {headerComponent}
              </VStack>
              <Box
                className="absolute -inset-8 bottom-0 bg-background"
                style={{ top: -(TOP_MARGIN + insets.top) }}
              />
            </Box>
          )}

          {canRenderContent && renderBody(contentComponent)}
          {isLoading && renderBody(loadingComponent)}
          {isError && <Center>{errorComponent}</Center>}
          {footerComponent}
        </Box>
      </SafeAreaView>
    </Box>
  );
}
