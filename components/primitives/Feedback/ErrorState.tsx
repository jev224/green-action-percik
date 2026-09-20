import type { ComponentProps } from "react";
import { View } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button } from "../Button/Button";

interface ErrorStateProps {
	icon?: ComponentProps<typeof Icon>["as"];
	message?: string;
	onRetry?: () => void;
}

const ErrorState = ({ icon, message, onRetry }: ErrorStateProps) => {
	return (
		<View className="w-full h-100 gap-8 justify-center items-center">
			<VStack space="sm" className="items-center">
				{icon && <Icon as={icon} className="size-28 mb-4 text-center" />}
				<Heading size="2xl">Terjadi kesalahan</Heading>
				<Text size="md" className="opacity-70 text-center">
					{message || "Halaman ini tidak dapat dimuat"}
				</Text>
			</VStack>

			<Button label="Coba lagi" onPress={onRetry} />
		</View>
	);
};

export default ErrorState;
