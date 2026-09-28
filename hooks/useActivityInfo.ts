import { useEffect, useState } from "react";
import { ActivityLocations, ActivityTypes } from "@/constants/activity";
import { getPublicInfoValue } from "@/services/fetcher/client/serverInformation";

type ActivityInfo = {
	locations: typeof ActivityLocations;
	types: typeof ActivityTypes;
};

const fallbackActivityInfo: ActivityInfo = {
	locations: ActivityLocations,
	types: ActivityTypes,
};

const initialActivityInfo: ActivityInfo = {
	locations: [],
	types: [],
};

const activityInfoKeys = {
	locations: "activity_locations",
	types: "activity_types",
} as const;

type ActivityInfoKey = keyof typeof activityInfoKeys;

export function useActivityInfo(
	requested: ActivityInfoKey | ActivityInfoKey[],
) {
	const keys = Array.isArray(requested) ? requested : [requested];
	const keysKey = keys.join(",");

	const [data, setData] = useState<ActivityInfo>(initialActivityInfo);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			setIsLoading(true);

			const results = await Promise.all(
				keys.map(async (key) => {
					try {
						const value = await getPublicInfoValue(activityInfoKeys[key]);

						return [key, JSON.parse(value)];
					} catch {
						// Server unavailable/invalid → keep fallback
						return [key, fallbackActivityInfo[key]];
					}
				}),
			);

			if (!cancelled) {
				setData(Object.fromEntries(results));
				setIsLoading(false);
			}
		};

		load();

		return () => {
			cancelled = true;
		};
	}, [keysKey]);

	return {
		...data,
		isLoading,
	};
}
