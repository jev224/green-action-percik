import { AlertCircle, Check } from "lucide-react-native";
import { useState } from "react";
import {
	Button,
	GradientHeading,
	Modal,
	Screen,
	ScreenHeader,
	TextField,
} from "@/components/primitives";
import {
	Checkbox,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import {
	FormControl,
	FormControlError,
	FormControlErrorIcon,
	FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useNavigation } from "@/hooks/useNavigation";
import { useSettings } from "@/hooks/useSettings";
import { authenticate } from "@/services/fetcher/account/auth";

import { getProfileByRole } from "@/services/fetcher/account/profile";
import { useUserStore } from "@/stores/userStore";
import { checkConnection, normalizeError, sleepAsync } from "@/utils";

export default function LoginScreen() {
	const { setUserStore, setRoleStore } = useUserStore();
	const { set, update, settings } = useSettings();
	const { navigateToHome } = useNavigation();

	const {
		rememberMe: rememberedFlag,
		rememberedUsername,
		rememberedPassword,
	} = settings;

	const initialUsername = rememberedFlag ? rememberedUsername : "";
	const initialPassword = rememberedFlag ? rememberedPassword : "";

	const [rememberMe, setRememberMe] = useState(rememberedFlag);
	const [username, setUsername] = useState(initialUsername);
	const [password, setPassword] = useState(initialPassword);
	const [isLoading, setIsLoading] = useState(false);

	const [networkDialogShown, setNetworkDialogShown] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		if (!username.trim() || !password.trim()) {
			setError("Username dan password wajib diisi");
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const isOnline = await checkConnection();

			if (!isOnline) {
				await sleepAsync(500); // Make it feels waiting for better ux
				setNetworkDialogShown(true);
				return;
			}

			const user = await authenticate(username.trim(), password.trim());

			// login successful
			const id = user.id;
			const role = user.app_metadata.user_role;
			const profile = await getProfileByRole(id, role);

			setUserStore(profile);
			setRoleStore(role);

			if (rememberMe) {
				update({
					rememberedUsername: username.trim(),
					rememberedPassword: password.trim(),
				});
			} else {
				update({
					rememberedUsername: "",
					rememberedPassword: "",
				});
			}

			navigateToHome();
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Login");
			setError(uiMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRememberMeChange = (isSelected: boolean) => {
		setRememberMe(isSelected);
		set("rememberMe", isSelected);
	};

	const hasError = !!error;

	return (
		<Screen
			scrollable
			avoidKeyboard
			headerComponent={<ScreenHeader title="Masuk" />}
			contentComponent={
				<>
					<VStack space="md" className="mt-6">
						<VStack space="sm">
							<Heading size="xl" className="tracking-tight">
								Selamat datang di
							</Heading>

							<GradientHeading className="tracking-tight">
								GREEN ACTION
							</GradientHeading>
						</VStack>

						<Text className="opacity-90">Masuk untuk melanjutkan!</Text>
					</VStack>

					<FormControl isInvalid={hasError}>
						<VStack space="xl" className="mt-4">
							<TextField
								placeholder="Username"
								value={username}
								onChangeText={(value) => {
									setUsername(value);
									setError(null);
								}}
								autoCapitalize="none"
								autoCorrect={false}
							/>

							<TextField
								placeholder="Password"
								value={password}
								onChangeText={(value) => {
									setPassword(value);
									setError(null);
								}}
								isPassword
								secureTextEntry
							/>

							<Checkbox
								value="remember"
								isChecked={rememberMe}
								onChange={handleRememberMeChange}
								className="ml-1"
							>
								<CheckboxIndicator>
									<CheckboxIcon as={Check} />
								</CheckboxIndicator>

								<CheckboxLabel>Ingat Saya!</CheckboxLabel>
							</Checkbox>

							{error && (
								<FormControlError>
									<FormControlErrorIcon
										as={AlertCircle}
										className="text-destructive"
									/>

									<FormControlErrorText className="text-destructive">
										{error}
									</FormControlErrorText>
								</FormControlError>
							)}
						</VStack>
					</FormControl>

					<Button
						size="cta"
						label="Masuk"
						isLoading={isLoading}
						onPress={handleLogin}
					/>
				</>
			}
			overlayComponent={
				<Modal
					isOpen={networkDialogShown}
					onClose={() => setNetworkDialogShown(false)}
					title="Tidak Ada Koneksi Internet"
					description="Periksa koneksi internet kamu lalu coba lagi"
					contentComponent={
						<Button label="Oke" onPress={() => setNetworkDialogShown(false)} />
					}
				/>
			}
		/>
	);
}
