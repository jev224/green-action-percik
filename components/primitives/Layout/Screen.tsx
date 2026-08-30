import { ReactNode } from "react";
import { Platform, RefreshControl, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Spinner } from "@/components/ui/spinner";

type ContentComponent<T> = ReactNode | ((data: NonNullable<T>) => ReactNode);

interface ScreenProps<T = undefined> {
  isLoading?: boolean;
  isError?: boolean;
  data?: T;
  overlayComponent?: ReactNode;
  portalComponent?: ReactNode;
  headerComponent?: ReactNode;
  contentComponent: ContentComponent<T>;
  errorComponent?: ReactNode;
  loadingComponent?: ReactNode;
  footerComponent?: ReactNode;
  space?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  scrollable?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function Screen<T = undefined>({
  isLoading,
  isError,
  data,
  space = "2xl",
  headerComponent,
  overlayComponent,
  contentComponent,
  errorComponent,
  loadingComponent,
  footerComponent,
  scrollable,
  isRefreshing,
  onRefresh,
}: ScreenProps<T>) {
  useThemeColors();

  const insets = useSafeAreaInsets();
  const isContentFn = typeof contentComponent === "function";

  const isDataMissing = isContentFn && (data === null || data === undefined);
  const effectiveIsLoading = isLoading || isDataMissing;
  const canRenderContent = !effectiveIsLoading && !isError;

  const isUsingDefaultLoading = effectiveIsLoading && !loadingComponent;

  // Pull-to-refresh needs a ScrollView regardless of the `scrollable` flag,
  // since the gesture requires a scroll container to attach to.
  const hasRefresh = !!onRefresh;
  const shouldScroll = (scrollable || hasRefresh) && !isUsingDefaultLoading;

  const renderedContent = canRenderContent
    ? isContentFn
      ? (contentComponent as (data: T) => ReactNode)(data as T)
      : contentComponent
    : null;

  const renderedLoading = loadingComponent ? (
    loadingComponent
  ) : (
    <Center className="flex-1">
      <Spinner />
    </Center>
  );

  const contentStyle = {
    flex: shouldScroll ? undefined : 1,
  };

  const content = (
    <SafeAreaView
      edges={headerComponent ? ["left", "right", "bottom"] : undefined}
      style={contentStyle}
    >
      <VStack className="px-8 py-6" style={contentStyle} space={space}>
        {canRenderContent && renderedContent}
        {effectiveIsLoading && renderedLoading}
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

      {shouldScroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          // Only real "scrollable" screens should stretch/scroll content freely.
          // Refresh-only screens (scrollable=false, hasRefresh=true) still need
          // the container to grow to fill height so layout doesn't break.
          contentContainerStyle={!scrollable ? { flexGrow: 1 } : undefined}
          refreshControl={
            hasRefresh ? (
              <RefreshControl
                refreshing={!!isRefreshing}
                onRefresh={onRefresh}
                progressViewOffset={
                  Platform.OS === "android"
                    ? headerComponent
                      ? 24
                      : insets.top + 8
                    : 100
                } // nudge below status bar on Android
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}

      {overlayComponent && (
        <Box className="absolute inset-0 -z-2">{overlayComponent}</Box>
      )}
    </Box>
  );
}
