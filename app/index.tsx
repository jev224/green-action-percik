import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Modal } from "@/components/primitives";
import { useNavigation } from "@/hooks/useNavigation";
import { getRole } from "@/services/auth";
import { type UserRole, useUserStore } from "@/stores/user";
import { checkConnection } from "@/utils";

export default function Index() {
	const { navigateToHome } = useNavigation();
	const { updateProfile } = useUserStore.getState();

	const [role, setRole] = useState<UserRole | null>(null);
	const [loading, setLoading] = useState(true);

	const [showNetworkDialog, setShowNetworkDialog] = useState(false);

	const loadRole = async () => {
		setLoading(true);

		const isOnline = await checkConnection();

		if (!isOnline) {
			setShowNetworkDialog(true);
			setLoading(false);
			return;
		}

		try {
			const fetchedRole = await getRole();
			setRole(fetchedRole);
		} finally {
			setLoading(false);
		}
	};

	const handleRetry = () => {
		setLoading(true);
		setShowNetworkDialog(false);
		setTimeout(loadRole, 2000);
	};

	useEffect(() => {
		loadRole();
	}, []);

	useEffect(() => {
		if (!loading && !showNetworkDialog) {
			updateProfile({ role });
			navigateToHome(role);
		}
	}, [loading, showNetworkDialog, role]);

	if (loading || showNetworkDialog) {
		return (
			<>
				<View className="bg-background flex-1" />

				<Modal
					isOpen={showNetworkDialog}
					onClose={handleRetry}
					title="Tidak Ada Koneksi Internet"
					description="Periksa koneksi internet kamu lalu coba lagi"
					contentComponent={<Button label="Oke" onPress={handleRetry} />}
				/>
			</>
		);
	}

	return (
		<View className="bg-background w-full flex-1 justify-center items-center">
			<ActivityIndicator />
		</View>
	);
}
