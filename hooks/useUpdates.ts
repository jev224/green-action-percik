import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useExpoUpdates() {
	const [isDownloading, setIsDownloading] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// OTA updates are not supported in Expo Go or web.
		if (__DEV__ || Platform.OS === "web" || !Updates.isEnabled) {
			return;
		}

		let cancelled = false;

		async function checkForUpdates() {
			try {
				const result = await Updates.checkForUpdateAsync();

				if (cancelled || !result.isAvailable) {
					return;
				}

				setIsDownloading(true);

				const download = await Updates.fetchUpdateAsync();

				if (cancelled) {
					return;
				}

				setProgress(1);

				if (download.isNew) {
					// Immediately restart using the downloaded update.
					await Updates.reloadAsync();
				}
			} catch (error) {
				console.warn("[Expo Updates] Update failed:", error);
			} finally {
				if (!cancelled) {
					setIsDownloading(false);
				}
			}
		}

		void checkForUpdates();

		return () => {
			cancelled = true;
		};
	}, []);

	return { isDownloading, progress };
}
