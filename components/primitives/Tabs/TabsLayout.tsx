import {
	createMaterialTopTabNavigator,
	type MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Platform } from "react-native";
import { TabBar, type TabConfig } from "./TabBar";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export function NavigationTabsLayout({
	tabConfigs,
}: {
	tabConfigs: TabConfig[];
}) {
	return (
		<MaterialTopTabs
			tabBar={(props: MaterialTopTabBarProps) => (
				<TabBar tabConfigs={tabConfigs} {...props} />
			)}
			screenOptions={{ swipeEnabled: Platform.OS !== "web" }}
		>
			{tabConfigs.map(({ name }, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Tab Screen is static element
				<MaterialTopTabs.Screen key={index} name={name} />
			))}
		</MaterialTopTabs>
	);
}
