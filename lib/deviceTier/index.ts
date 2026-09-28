import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";

export type DeviceTier = "low" | "mid" | "high";

const GB = 1024 ** 3;

function computeTier(): DeviceTier {
	if (Platform.OS === "web") return "high";

	const mem = Device.totalMemory; // bytes | null, reads a bit under nominal RAM

	if (Platform.OS === "ios") {
		return mem != null && mem < 3 * GB ? "low" : "high";
	}

	// Android
	if (typeof Platform.Version === "number" && Platform.Version < 28)
		return "low";
	if (mem == null) return "mid";
	if (mem < 3.5 * GB) return "low"; // ≤3GB nominal
	if (mem < 5 * GB) return "mid"; // 4GB nominal
	return "high"; // 6GB+
}

export const DEVICE_TIER: DeviceTier = computeTier();

export function useReduceMotion() {
	const [reduce, setReduce] = useState(false);
	useEffect(() => {
		let mounted = true;
		AccessibilityInfo.isReduceMotionEnabled().then((v) => {
			if (mounted) setReduce(v);
		});
		const sub = AccessibilityInfo.addEventListener(
			"reduceMotionChanged",
			setReduce,
		);
		return () => {
			mounted = false;
			sub.remove();
		};
	}, []);
	return reduce;
}
