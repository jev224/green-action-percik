import { useCallback, useRef } from "react";
import { addToast } from "@/components/primitives/Feedback/Toast/toastStack";
import type { ToastOptions } from "@/components/primitives/Feedback/Toast/type";

export function useShowToast() {
	const toastIdRef = useRef(0);

	const showToast = useCallback((options: ToastOptions) => {
		addToast({
			...options,
			id: `${toastIdRef.current++}`,
			duration: options.duration ?? 3000,
		});
	}, []);

	return showToast;
}
