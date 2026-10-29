import { Image } from "expo-image";
import { Expand, Info, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { IconButton, Spinner } from "..";

type PhotoLightboxProps = {
	photoUri?: string;
	isLoading?: boolean;
	errorMessage?: string;
	onLoadEnd?: () => void;
	expandable?: boolean;
};

export const PhotoLightbox = ({
	photoUri,
	isLoading,
	errorMessage,
	onLoadEnd,
	expandable,
}: PhotoLightboxProps) => {
	const insets = useSafeAreaInsets();
	const closeIconOffset = Math.max(16, insets.top);

	// Starts closed; `expandable` only controls whether the user can open it.
	const [expanded, setExpanded] = useState(false);

	const canExpand = !!expandable && !!photoUri && !isLoading && !errorMessage;

	const open = () => setExpanded(true);
	const close = () => setExpanded(false);

	return (
		<>
			<View className="w-full h-64 bg-accent-foreground/20 rounded-lg overflow-hidden">
				{isLoading && (
					<Center className="absolute w-full h-full">
						<Spinner />
					</Center>
				)}

				{(errorMessage || undefined) && (
					<Center className="absolute w-full h-full gap-4">
						<Icon as={Info} className="size-16" />
						<Text size="lg" className="max-w-[60%] text-center">
							{errorMessage}
						</Text>
					</Center>
				)}

				{photoUri && (
					<Image
						onLoadEnd={onLoadEnd}
						contentFit="cover"
						style={{ position: "absolute", inset: 0 }}
						source={photoUri}
						cachePolicy="memory-disk"
					/>
				)}

				{canExpand && (
					<View className="absolute right-3 bottom-3">
						<IconButton
							icon={Expand}
							onPress={open}
							variant="default"
							size="md"
						/>
					</View>
				)}
			</View>

			<Modal
				visible={expanded}
				transparent
				animationType="fade"
				statusBarTranslucent
				onRequestClose={close} // Android back button
			>
				<StatusBar hidden={expanded} />

				<View className="flex-1 bg-black/95">
					{/* Tap anywhere on the photo or backdrop to dismiss */}
					<Pressable className="flex-1" onPress={close}>
						{photoUri && (
							<Image
								contentFit="contain"
								style={{ flex: 1 }}
								source={photoUri}
								cachePolicy="memory-disk"
							/>
						)}
					</Pressable>

					<View
						className="absolute right-3"
						style={{
							top: closeIconOffset,
						}}
					>
						<IconButton
							className="bg-background/60!"
							icon={X}
							onPress={close}
							variant="outline"
						/>
					</View>
				</View>
			</Modal>
		</>
	);
};
