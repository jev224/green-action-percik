// hooks/useHaptics.ts

import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Platform } from "react-native";

type HapticAction =
	| "buttonPress"
	| "cardPress"
	| "actionPress"
	| "longPress"
	| "toggle"
	| "selection"
	| "success"
	| "warning"
	| "error"
	| "refresh";

// each action defines what actually fires per-platform
const triggers: Record<
	HapticAction,
	{ ios: () => Promise<void>; android: () => Promise<void> }
> = {
	buttonPress: {
		ios: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
		android: () =>
			Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click),
	},
	cardPress: {
		ios: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
		android: () => Haptics.selectionAsync(),
	},
	actionPress: {
		ios: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
		android: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
	},
	longPress: {
		ios: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
		android: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid),
	},
	toggle: {
		ios: () => Haptics.selectionAsync(),
		android: () => Haptics.selectionAsync(),
	},
	selection: {
		ios: () => Haptics.selectionAsync(),
		android: () => Haptics.selectionAsync(),
	},
	success: {
		ios: () =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
		android: () =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
	},
	warning: {
		ios: () =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
		android: () =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
	},
	error: {
		ios: () =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
		android: () =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
	},
	refresh: {
		ios: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
		android: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
	},
};

const isSupported = Platform.OS === "ios" || Platform.OS === "android";

export function useHaptics() {
	const trigger = useCallback((action: HapticAction) => {
		if (!isSupported) return;
		const fn =
			Platform.OS === "ios" ? triggers[action].ios : triggers[action].android;
		fn();
	}, []);

	return { trigger };
}
