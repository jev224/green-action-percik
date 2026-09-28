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
	title?: string;
	buttonLabel?: string;
	onRetry?: () => void;
}

const ErrorState = ({
	icon,
	message,
	title = "Terjadi kesalahan",
	buttonLabel = "Coba lagi",
	onRetry,
}: ErrorStateProps) => {
	return (
		<View className="w-full h-100 gap-8 justify-center items-center">
			<VStack space="sm" className="items-center">
				{icon && <Icon as={icon} className="w-28 h-28 mb-4 text-center" />}
				<Heading size="2xl">{title}</Heading>
				<Text size="md" className="opacity-70 text-center">
					{message || "Halaman ini tidak dapat dimuat"}
				</Text>
			</VStack>

			<Button label={buttonLabel} onPress={onRetry} />
		</View>
	);
};

export default ErrorState;
