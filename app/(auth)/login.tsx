import { useState } from "react";

import {
  GradientHeading,
  Screen,
  ScreenHeader,
  TextField,
  Button,
  Modal,
} from "@/components/primitives";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control";

import { AlertCircle, Check } from "lucide-react-native";
import { authenticate } from "@/services/auth";
import { useUserStore } from "@/stores/user";
import { useNavigation } from "@/hooks/useNavigation";
import { checkConnection, sleepAsync } from "@/utils";
import { useSettings } from "@/hooks/useSettings";

export default function LoginScreen() {
  const { set, update, settings } = useSettings();
  const { updateProfile } = useUserStore.getState();
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

  const checkNetwork = async () => {
    const isOnline = await checkConnection();

    if (!isOnline) {
      setNetworkDialogShown(true);
    }

    return isOnline;
  };

  const handleLogin = async () => {
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi");
      return;
    }

    try {
      setIsLoading(true);

      await sleepAsync(1000);

      if (!(await checkNetwork())) {
        return;
      }

      const { error: authError, data } = await authenticate(
        username.trim(),
        password.trim(),
      );

      if (authError) {
        console.log("[Auth Error]:", authError);
        setError("Username atau password salah");
        return;
      }

      // login successful
      const role = data.user.app_metadata.user_role;
      updateProfile({ role });

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

      navigateToHome(role);
    } catch (err) {
      if (!(await checkNetwork())) {
        return;
      }

      console.log("[Auth Error]:", err);
      setError("Terjadi kendala, coba lagi");
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
      headerComponent={<ScreenHeader title="Masuk" />}
      contentComponent={
        <>
          <VStack space="md" className="mt-6">
            <VStack space="sm">
              <Heading size="xl" className="tracking-tight">
                Selamat datang di
              </Heading>

              <GradientHeading size="3xl" className="tracking-tight">
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
