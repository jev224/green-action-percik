import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	initialWindowMetrics,
	SafeAreaListener,
	SafeAreaProvider,
} from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { ToastHost } from "@/components/primitives/Feedback/Toast/ToastHost";
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
	const { colors, scheme } = useThemeColors();

	useEffect(() => {
		if (Platform.OS === "web") {
			let meta = document.querySelector('meta[name="theme-color"]');

			if (!meta) {
				meta = document.createElement("meta");
				meta.setAttribute("name", "theme-color");
				document.head.appendChild(meta);
			}

			meta.setAttribute("content", colors.background);
		}
	}, [colors.background, scheme]);

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<SafeAreaListener
				onChange={({ insets }) => {
					Uniwind.updateInsets(insets);
				}}
			>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<GluestackUIProvider mode={scheme}>
						<StatusBar style={scheme === "dark" ? "light" : "dark"} />

						<Stack screenOptions={{ headerShown: false }} />
					</GluestackUIProvider>

					<ToastHost />
				</GestureHandlerRootView>
			</SafeAreaListener>
		</SafeAreaProvider>
	);
}
