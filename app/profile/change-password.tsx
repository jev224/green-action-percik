import { AlertCircle } from "lucide-react-native";
import { useState } from "react";
import { BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ListSection,
	Modal,
	Screen,
	ScreenHeader,
	TextField,
} from "@/components/primitives";
import {
	FormControl,
	FormControlError,
	FormControlErrorIcon,
	FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@/hooks/useNavigation";
import { changePassword } from "@/services/fetcher/shared/password";
import { checkConnection, sleepAsync } from "@/utils";

export default function ChangePasswordScreen() {
	const { goBack } = useNavigation();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [networkDialogShown, setNetworkDialogShown] = useState(false);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		setErrorMessage(null);
		setIsLoading(true);

		const isOnline = await checkConnection();

		if (!isOnline) {
			await sleepAsync(500); // Make it feels waiting for better ux
			setNetworkDialogShown(true);
			return;
		}

		const result = await changePassword(oldPassword, newPassword, confirmation);

		setIsLoading(false);

		if (!result.isSuccessful) {
			setErrorMessage(result.validationErrorMessage);
			return;
		}

		goBack();
	};

	return (
		<Screen
			headerComponent={
				<ScreenHeader title="Ubah Kata Sandi" leftComponent={<BackButton />} />
			}
			overlayComponent={
				<>
					<Modal
						isOpen={networkDialogShown}
						onClose={() => setNetworkDialogShown(false)}
						title="Tidak Ada Koneksi Internet"
						description="Periksa koneksi internet kamu lalu coba lagi"
						contentComponent={
							<Button
								label="Oke"
								onPress={() => setNetworkDialogShown(false)}
							/>
						}
					/>

					<BottomPanel variant="ghost">
						<HStack space="md">
							<Button
								label="Konfirmasi"
								fill
								size="cta"
								onPress={handleSubmit}
								isDisabled={isLoading}
							/>
						</HStack>
					</BottomPanel>
				</>
			}
			contentComponent={
				<FormControl isInvalid={!!errorMessage}>
					<VStack space="lg">
						<ListSection title="Kata sandi lama">
							<TextField
								placeholder="Masukkan kata sandi lama"
								isPassword
								value={oldPassword}
								onChangeText={setOldPassword}
							/>
						</ListSection>

						<ListSection title="Kata sandi baru">
							<TextField
								placeholder="Masukkan kata sandi baru"
								isPassword
								value={newPassword}
								onChangeText={setNewPassword}
							/>

							<TextField
								placeholder="Konfirmasi kata sandi baru"
								isPassword
								value={confirmation}
								onChangeText={setConfirmation}
							/>
						</ListSection>

						{errorMessage && (
							<FormControlError>
								<FormControlErrorIcon
									as={AlertCircle}
									className="text-destructive"
								/>

								<FormControlErrorText className="text-destructive">
									{errorMessage}
								</FormControlErrorText>
							</FormControlError>
						)}
					</VStack>
				</FormControl>
			}
		/>
	);
}
