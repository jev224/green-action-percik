import { useThemeColors } from "@/hooks/useThemeColors";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  const { colors } = useThemeColors();

  return (
    <NativeTabs
      // Always show labels on Android (default hides unselected labels once >3 tabs)
      labelVisibilityMode="labeled"
      backgroundColor={colors.card}
      tintColor={colors.primary}
      iconColor={{
        default: colors.mutedForeground,
        selected: colors.primary,
      }}
      labelStyle={{
        default: {
          fontSize: 12,
          fontWeight: "500",
          color: colors.mutedForeground,
        },
        selected: {
          fontSize: 12,
          fontWeight: "600",
          color: colors.primary,
        },
      }}
      rippleColor="transparent"
      indicatorColor={colors.accent}
      badgeBackgroundColor={colors.destructive}
      badgeTextColor={colors.destructiveForeground}
      backBehavior="initialRoute"
      sidebarAdaptable
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="learn">
        <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="bar_chart" />
        <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        <NativeTabs.Trigger.Label>Me</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
