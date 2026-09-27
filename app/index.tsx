import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Modal, Spinner } from "@/components/primitives";
import { useNavigation } from "@/hooks/useNavigation";
import {
	getProfileByRole,
	getUserData,
} from "@/services/fetcher/account/profile";
import { useUserStore } from "@/stores/userStore";
import { checkConnection, normalizeError } from "@/utils";

export default function Index() {
	const { setUserStore, setRoleStore } = useUserStore();

	const [errorMessage, setErrorMessage] = useState("");
	const [showNetworkDialog, setShowNetworkDialog] = useState(false);

	const { navigateToHome, resetTo } = useNavigation();

	const loadRole = async () => {
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
	};

	const handleRetry = () => {
		setShowNetworkDialog(false);
		setErrorMessage("");
		setTimeout(loadRole, 2000);
	};

	useEffect(() => {
		loadRole();
	}, []);

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
