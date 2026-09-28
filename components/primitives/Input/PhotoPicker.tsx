import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { File } from "expo-file-system";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, RotateCcwIcon, XIcon } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
	type GestureResponderEvent,
	Linking,
	Platform,
	Pressable,
} from "react-native";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button } from "../Button/Button";
import { Modal } from "../Layout/Modal";

// Target upper bound for the final compressed photo.
// NOTE: 5kb is very aggressive — expect roughly thumbnail-level detail.
// Bump this up (e.g. 50 * 1024) if you actually need visible detail.
const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024;
const MAX_COMPRESSION_ATTEMPTS = 8;

const photoPickerStyle = tva({
	base: "h-64 rounded-xl overflow-hidden border-2 border-dashed border-border bg-background-50",
	variants: {
		hasPhoto: {
			true: "border-solid bg-background-0",
			false: "",
		},
		pressed: {
			true: "opacity-70",
			false: "",
		},
	},
});

/**
 * Iteratively resizes + re-compresses a JPEG until it's under MAX_FILE_SIZE_BYTES,
 * or gives up after MAX_COMPRESSION_ATTEMPTS and returns the smallest version found.
 * Quality alone rarely gets JPEGs down to a few KB, so width is stepped down too.
 */
async function compressToTargetSize(sourceUri: string): Promise<string> {
	let quality = 0.7;
	let width = 800;
	let bestUri = sourceUri;

	for (let attempt = 0; attempt < MAX_COMPRESSION_ATTEMPTS; attempt++) {
		const manipulated = await ImageManipulator.manipulateAsync(
			sourceUri,
			[{ resize: { width } }],
			{ compress: quality, format: ImageManipulator.SaveFormat.JPEG },
		);

		const file = new File(manipulated.uri);
		const size = file.exists
			? (file.size ?? Number.POSITIVE_INFINITY)
			: Number.POSITIVE_INFINITY;

		bestUri = manipulated.uri;

		if (size <= MAX_FILE_SIZE_BYTES) {
			return manipulated.uri;
		}

		quality = Math.max(0.1, quality - 0.15);
		width = Math.max(80, Math.floor(width * 0.75));
	}

	return bestUri;
}

type PhotoPickerProps = Omit<
	React.ComponentPropsWithoutRef<typeof Box>,
	"children"
> & {
	/** Controlled photo uri. Omit to let the component manage its own state. */
	value?: string | null;
	/** Called with the compressed photo uri, or null if cleared. */
	onChange?: (uri: string | null) => void;
	className?: string;
};

export const PhotoPicker = React.forwardRef<
	React.ComponentRef<typeof Box>,
	PhotoPickerProps
>(({ value, onChange, className, ...props }, ref) => {
	const [internalUri, setInternalUri] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [deniedDialogShown, setDeniedDialogShown] = useState(false);

	const [isPressed, setIsPressed] = useState(false);

	const isControlled = value !== undefined;
	const uri = isControlled ? value : internalUri;

	const setUri = useCallback(
		(next: string | null) => {
			if (!isControlled) setInternalUri(next);
			onChange?.(next);
		},
		[isControlled, onChange],
	);

	const openCamera = useCallback(async () => {
		if (isProcessing) return;

		const permission = await ImagePicker.requestCameraPermissionsAsync();

		if (!permission.granted) {
			setDeniedDialogShown(true);
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			quality: 1,
		});

		if (result.canceled || !result.assets?.[0]) return;

		setIsProcessing(true);
		try {
			const compressedUri = await compressToTargetSize(result.assets[0].uri);
			setUri(compressedUri);
		} finally {
			setIsProcessing(false);
		}
	}, [isProcessing, setUri]);

	const handleRemove = useCallback(
		(e: GestureResponderEvent) => {
			e.stopPropagation?.();
			setUri(null);
		},
		[setUri],
	);

	return (
		<>
			<Pressable
				onPress={openCamera}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				disabled={isProcessing}
			>
				<Box
					ref={ref}
					className={photoPickerStyle({
						hasPhoto: !!uri,
						pressed: isPressed && !uri,
						class: className,
					})}
					{...props}
				>
					{uri ? (
						<>
							<Image
								source={uri}
								alt="Foto yang diambil"
								style={{ position: "absolute", inset: 0 }}
								contentFit="cover"
							/>

							{/* bottom action bar: retake / remove */}
							<HStack
								className="absolute bottom-2 left-2 right-2 bg-card rounded-md p-2"
								space="sm"
							>
								<Button
									fill
									label="Ulang"
									size="lg"
									icon={RotateCcwIcon}
									variant="secondary"
									onPress={openCamera}
									className="rounded-xs"
								/>

								<Button
									fill
									label="Hapus"
									size="lg"
									icon={XIcon}
									variant="destructive"
									onPress={handleRemove}
									className="rounded-xs"
								/>
							</HStack>
						</>
					) : (
						<Center
							className="flex-1 h-full"
							style={{
								opacity: isProcessing ? 0 : 1,
							}}
						>
							<VStack space="md" className="items-center">
								<Center className="w-14 h-14 rounded-full bg-background-100">
									<Icon
										as={CameraIcon}
										className="text-foreground/70 w-16 h-16"
									/>
								</Center>
								<Text className="font-medium" size="xl">
									Ambil Foto
								</Text>
							</VStack>
						</Center>
					)}

					{isProcessing && (
						<Center className="absolute inset-0 bg-background-950/40">
							<VStack space="sm" className="items-center">
								<Spinner size={"large"} />
								<Text className="font-medium">Memproses...</Text>
							</VStack>
						</Center>
					)}
				</Box>
			</Pressable>

			<Modal
				isOpen={deniedDialogShown}
				onClose={() => setDeniedDialogShown(false)}
				title="Izin Kamera Diperlukan"
				description="Aplikasi memerlukan akses kamera untuk mengambil foto. Silakan izinkan akses kamera melalui pengaturan perangkat Anda."
				contentComponent={
					<>
						{Platform.OS !== "web" && (
							<Button
								label="Pengaturan"
								variant="secondary"
								onPress={Linking.openSettings}
							/>
						)}
						<Button
							label="Mengerti"
							onPress={() => setDeniedDialogShown(false)}
						/>
					</>
				}
			/>
		</>
	);
});

PhotoPicker.displayName = "PhotoPicker";
