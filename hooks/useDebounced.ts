import { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
) {
	const callbackRef = useRef(callback);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Always call the latest callback
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const cancel = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	// Cancel pending call on unmount
	useEffect(() => cancel, [cancel]);

	const debounced = useCallback(
		(...args: Args) => {
			cancel();
			timeoutRef.current = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);
		},
		[delay, cancel],
	);

	return Object.assign(debounced, { cancel });
}
