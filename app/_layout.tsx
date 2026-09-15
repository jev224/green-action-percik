import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  initialWindowMetrics,
  SafeAreaListener,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Uniwind } from "uniwind";
import { useThemeColors } from "@/hooks/useThemeColors";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { scheme } = useThemeColors();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaListener
        onChange={({ insets }) => {
          Uniwind.updateInsets(insets);
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GluestackUIProvider mode={scheme}>
            <StatusBar style={scheme} />
            <Stack screenOptions={{ headerShown: false }} />
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </SafeAreaListener>
    </SafeAreaProvider>
  );
}
