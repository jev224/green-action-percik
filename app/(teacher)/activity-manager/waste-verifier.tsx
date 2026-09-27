import { Image } from "expo-image";
import { Check, Coins, Info } from "lucide-react-native";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ListSection,
	Modal,
	Screen,
	ScreenHeader,
	Spinner,
	StatCard,
	TextField,
} from "@/components/primitives";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import {
	Checkbox,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import {
	deleteWasteBank,
	fetchWastePhotoURL,
	fetchWastePriceMultiplier,
	updateWasteBank,
} from "@/services/fetcher/activity/teacherActivityManager";
import { useActivityManagerStore } from "@/stores/activityManager";
import { formatPrice, normalizeError } from "@/utils";

const WASTE_PRICE_MULTIPLIER_FALLBACK = 3000;

export default function WasteVerifierScreen() {
	const selectedWaste = useActivityManagerStore((s) => s.selectedWaste);
	const sourceSection = useActivityManagerStore((s) => s.sourceSection);
	const isEditing = sourceSection === "completed";

	const { goBack } = useNavigation();
	const showToast = useShowToast();

	const [isSubmitting, setSubmitting] = useState(false);
	const [isImageLoading, setImageLoading] = useState(true);
	const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false);
	const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [customPriceEnabled, setCustomPriceEnabled] = useState(false);
	const [customPrice, setCustomPrice] = useState("0");
	const [weight, setWeight] = useState(`${selectedWaste?.weight || 0}`);

	const {
		data,
		errorMessage,
		isLoading: isFetchLoading,
		isError,
	} = useAsyncData(async () => {
		const [wastePhoto, priceMultiplier] = await Promise.all([
			selectedWaste?.photo
				? fetchWastePhotoURL(selectedWaste.photo)
				: Promise.resolve(undefined),
			fetchWastePriceMultiplier(),
		]);

		return { wastePhoto, priceMultiplier };
	});

	const photoUri = data?.wastePhoto;
	const isPhotoLoading = isFetchLoading || isImageLoading;
	const showPhotoError = isError && !isFetchLoading;

	const priceMultiplier =
		Number(data?.priceMultiplier) || WASTE_PRICE_MULTIPLIER_FALLBACK;

	const parsedWeight = Number(weight);
	const parsedCustomPrice = Number(customPrice);

	const calculatedPrice = parsedWeight * priceMultiplier;
	const finalPrice = customPriceEnabled ? parsedCustomPrice : calculatedPrice;

	useEffect(() => {
		if (!selectedWaste) goBack();
	}, [selectedWaste, goBack]);

	if (!selectedWaste) return null;

	const handleVerify = async () => {
		setSubmitting(true);
		try {
			await updateWasteBank(selectedWaste.id, {
				weight: parsedWeight,
				price: finalPrice,
			});
			setVerifyDialogOpen(false);
			showToast({
				title: isEditing
					? "Data sampah berhasil diubah"
					: "Bank sampah berhasil diverifikasi",
			});
			goBack();
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Waste Bank Verify");
			showToast({ title: uiMessage });
		} finally {
			setSubmitting(false);
		}
	};

	const handleReject = async () => {
		setSubmitting(true);
		try {
			await deleteWasteBank(selectedWaste.id);
			setRejectDialogOpen(false);
			showToast({ title: "Bank sampah ditolak" });
			goBack();
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Waste Bank Reject");
			showToast({ title: uiMessage });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Screen
			requiredInternet
			headerComponent={
				<ScreenHeader
					title={isEditing ? "Ubah data sampah" : "Verifikasi bank sampah"}
					leftComponent={<BackButton />}
				/>
			}
			overlayComponent={
				<>
					<Modal
						isOpen={isVerifyDialogOpen}
						onClose={() => setVerifyDialogOpen(false)}
						title={isEditing ? "Ubah bank sampah" : "Verifikasi bank sampah"}
						description={
							isEditing
								? `Apakah anda yakin ingin mengubah berat sampah menjadi ${weight || 0} kg?`
								: `Apakah anda sudah yakin ingin verifikasi berat sampah sebesar ${weight || 0} kg?`
						}
						contentComponent={
							<>
								<Button
									isDisabled={isSubmitting}
									label="Batalkan"
									variant="outline"
									onPress={() => setVerifyDialogOpen(false)}
								/>

								<Button
									isLoading={isSubmitting}
									label={isEditing ? "Ubah" : "Verifikasi"}
									onPress={handleVerify}
								/>
							</>
						}
					/>

					<Modal
						isOpen={isRejectDialogOpen}
						onClose={() => setRejectDialogOpen(false)}
						title="Tolak bank sampah"
						description="Kegiatan ini akan ditolak dan siswa perlu mengirim ulang. Tindakan ini tidak dapat dibatalkan."
						contentComponent={
							<>
								<Button
									isDisabled={isSubmitting}
									label="Batalkan"
									variant="outline"
									onPress={() => setRejectDialogOpen(false)}
								/>

								<Button
									isLoading={isSubmitting}
									label="Tolak"
									variant="destructive"
									onPress={handleReject}
								/>
							</>
						}
					/>

					<BottomPanel variant="ghost">
						<HStack space="md">
							<Button
								label="Tolak"
								fill
								size="cta"
								variant="destructive"
								onPress={() => setRejectDialogOpen(true)}
							/>

							<Button
								label={isEditing ? "Ubah" : "Verifikasi"}
								fill
								size="cta"
								variant="default"
								isDisabled={parsedWeight === 0}
								onPress={() => setVerifyDialogOpen(true)}
							/>
						</HStack>
					</BottomPanel>
				</>
			}
			contentComponent={
				<>
					{selectedWaste.photo && (
						<Box className="w-full h-64 bg-accent-foreground/20 rounded-md overflow-hidden">
							{isPhotoLoading && (
								<Center className="absolute w-full h-full">
									<Spinner />
								</Center>
							)}

							{showPhotoError && (
								<Center className="absolute w-full h-full gap-4">
									<Icon as={Info} className="size-16" />
									<Text size="lg" className="max-w-[60%] text-center">
										{errorMessage}
									</Text>
								</Center>
							)}

							{photoUri && (
								<Image
									onLoadEnd={() => setImageLoading(false)}
									contentFit="cover"
									style={{ position: "absolute", inset: 0 }}
									source={photoUri}
								/>
							)}
						</Box>
					)}

					<ListSection title="Harga sampah">
						<VStack space="sm">
							<StatCard
								title="Saldo total"
								stats={`Rp ${formatPrice(customPriceEnabled ? parseFloat(customPrice) || 0 : calculatedPrice)}`}
								icon={Coins}
								variant="outline"
								size="md"
								color="info"
							/>
							{!customPriceEnabled && (
								<Text>
									Harga sampah per kg adalah:{" "}
									<Text bold>Rp {formatPrice(priceMultiplier)}</Text>
								</Text>
							)}
						</VStack>

						{customPriceEnabled && (
							<TextField
								placeholder="Masukan harga sampah"
								isDecimal
								min={0}
								unit="Rp"
								value={customPrice}
								onChangeText={setCustomPrice}
							/>
						)}

						<Checkbox
							value="custom-price"
							isChecked={customPriceEnabled}
							onChange={setCustomPriceEnabled}
							className="ml-1"
						>
							<CheckboxIndicator>
								<CheckboxIcon as={Check} />
							</CheckboxIndicator>

							<CheckboxLabel>Harga kustom</CheckboxLabel>
						</Checkbox>
					</ListSection>

					<ListSection title="Berat sampah (kg)">
						<TextField
							placeholder="Masukan berat sampah"
							isDecimal
							min={0}
							unit="kg"
							value={weight}
							onChangeText={setWeight}
						/>
					</ListSection>
				</>
			}
		/>
	);
}
