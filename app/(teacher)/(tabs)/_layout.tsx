import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useThemeColors } from "@/hooks/useThemeColors";

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
			indicatorColor={colors.accent}
			rippleColor={colors.ring}
			badgeBackgroundColor={colors.destructive}
			badgeTextColor={colors.destructiveForeground}
			backBehavior="initialRoute"
			sidebarAdaptable
		>
			<NativeTabs.Trigger name="home">
				<NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="house.fill" md="home" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="students">
				<NativeTabs.Trigger.Icon sf="person.crop.artframe" md="people" />
				<NativeTabs.Trigger.Label>Students</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="lessons">
				<NativeTabs.Trigger.Icon sf="book" md="book" />
				<NativeTabs.Trigger.Label>Lessons</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="profile">
				<NativeTabs.Trigger.Icon sf="person.fill" md="person" />
				<NativeTabs.Trigger.Label>Me</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
