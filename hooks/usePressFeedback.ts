// hooks/usePressFeedback.ts
//
// Old code hand-rolled "scale down + haptic on press" separately in
// AnimatedButton AND again in ActionCard, with slightly different timing
// each time. One hook now — every pressable surface in the app feels
// the same because they're all calling the same numbers.

import { useState } from "react";
import type { SingleTransition } from "react-native-ease";
import { useHaptics } from "./useHaptics";

export const PRESS_SCALE_TRANSITION = {
	type: "timing",
	easing: "easeOut",
	duration: 150,
} satisfies SingleTransition;

export const PRESS_OPACITY_TRANSITION = {
	type: "timing",
	easing: "easeOut",
	duration: 100,
} satisfies SingleTransition;

export function usePressFeedback(targetScale = 1.05) {
	const { trigger } = useHaptics();
	const [isPressing, setIsPressing] = useState(false);

	const bind = {
		onPressIn: () => {
			trigger("buttonPress");
			setIsPressing(true);
		},
		onPressOut: () => {
			trigger("buttonPress");
			setIsPressing(false);
		},
	};

	return {
		isPressing,
		bind,
		scaleAnimation: { scale: isPressing ? targetScale : 1.0 },
	};
}
