import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { Button, Modal, Spinner } from "@/components/primitives";
import { useNavigation } from "@/hooks/useNavigation";
import {
	getProfileByRole,
	getUserData,
} from "@/services/fetcher/account/profile";
import { getMinimumSupportedVersion } from "@/services/fetcher/client/clientUpdater";
import { useUserStore } from "@/stores/userStore";
import { checkConnection, compareVersions, normalizeError } from "@/utils";

let UpdaterScreenAlreadyShown = false;

export default function Index() {
	const { setUserStore, setRoleStore } = useUserStore();

	const initializingRef = useRef(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [showNetworkDialog, setShowNetworkDialog] = useState(false);

	const { navigateToHome, resetTo } = useNavigation();

	const loadRole = useCallback(async () => {
		const isOnline = await checkConnection();

		if (!isOnline) {
			setShowNetworkDialog(true);
			return;
		}

		try {
			const data = await getUserData();

			if (!data) {
				resetTo("/(auth)/login");
				return;
			}

			const { id, role } = data;
			const profile = await getProfileByRole(id, role);

			setUserStore(profile);
			setRoleStore(role);

			navigateToHome();
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Initial Screen");
			setErrorMessage(uiMessage);
		}
	}, [navigateToHome, resetTo, setRoleStore, setUserStore]);

	const initialize = useCallback(async () => {
		if (initializingRef.current) return;
		initializingRef.current = true;

		try {
			if (Platform.OS === "android" && !UpdaterScreenAlreadyShown) {
				const minimalVersion = await getMinimumSupportedVersion();
				const currentVersion = Constants.expoConfig?.version;

				let needsUpdate = false;

				if (currentVersion && minimalVersion) {
					const result = compareVersions(currentVersion, minimalVersion);
					needsUpdate = result < 0;
				}

				if (needsUpdate) {
					resetTo("/updater");
					UpdaterScreenAlreadyShown = true;
					initializingRef.current = false;
					return;
				}
			}
		} catch (e) {
			console.warn("Version check failed", e);
		}

		await loadRole();

		initializingRef.current = false;
	}, [loadRole, resetTo]);

	const handleRetry = () => {
		setShowNetworkDialog(false);
		setErrorMessage("");
		setTimeout(initialize, 2000);
	};

	useFocusEffect(
		useCallback(() => {
			initialize();
		}, [initialize]),
	);

	return (
		<View className="bg-background w-full h-full flex-1 justify-center items-center">
			<Spinner />

			<Modal
				isOpen={errorMessage !== ""}
				onClose={handleRetry}
				title="Terjadi kesalahan!"
				description={errorMessage}
				contentComponent={<Button label="Oke" onPress={handleRetry} />}
			/>

			<Modal
				isOpen={showNetworkDialog}
				onClose={handleRetry}
				title="Tidak Ada Koneksi Internet"
				description="Periksa koneksi internet kamu lalu coba lagi"
				contentComponent={<Button label="Oke" onPress={handleRetry} />}
			/>
		</View>
	);
}
