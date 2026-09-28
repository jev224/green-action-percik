import Fuse, { type IFuseOptions } from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { throttle } from "@/utils";

export function useFuzzySearch<T>(
	data: T[],
	keys: string[],
	query: string,
	options?: IFuseOptions<T>,
	throttleMs = 300,
) {
	const fuse = useMemo(
		() =>
			new Fuse(data, {
				keys,
				threshold: 0.35,
				ignoreLocation: true,
				...options,
			}),
		[data, keys, options],
	);

	const trimmed = query.trim();
	const [throttledQuery, setThrottledQuery] = useState(trimmed);

	// Leading + trailing: the first keystroke updates instantly, and the
	// final value is always applied at the end of the window.
	const updateQuery = useMemo(
		() => throttle(setThrottledQuery, throttleMs, { trailing: true }),
		[throttleMs],
	);

	useEffect(() => {
		updateQuery(trimmed);
	}, [trimmed, updateQuery]);

	// Drop any pending trailing call on unmount
	useEffect(() => () => updateQuery.cancel(), [updateQuery]);

	return useMemo(() => {
		// Clearing the input resets the list instantly
		if (!trimmed || !throttledQuery) return data;
		return fuse.search(throttledQuery).map((result) => result.item);
	}, [fuse, trimmed, throttledQuery, data]);
}
