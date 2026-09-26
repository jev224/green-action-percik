import { useCallback } from "react";
import { addToast } from "@/components/primitives/Feedback/Toast/toastStack";
import type { ToastOptions } from "@/components/primitives/Feedback/Toast/type";

let toastIdIncrement = 0;

export function useShowToast() {
	const showToast = useCallback((options: ToastOptions) => {
		addToast({
			...options,
			id: `${toastIdIncrement++}`,
			duration: options.duration ?? 3000,
		});
	}, []);

	return showToast;
}
