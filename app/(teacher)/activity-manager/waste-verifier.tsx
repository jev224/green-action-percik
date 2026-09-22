import { Info } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
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
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import {
  deleteWasteBank,
  fetchWastePhotoURL,
  updateWasteBank,
} from "@/services/fetcher/activity/teacherActivityManager";
import { useActivityManagerStore } from "@/stores/activityManager";
import { normalizeError } from "@/utils";
import { Image } from "expo-image";

export default function WasteVerificationScreen() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [verifyDialogShown, setVerifyDialogShown] = useState(false);
  const [rejectDialogShown, setRejectDialogShown] = useState(false);
  const [weight, setWeight] = useState("");

  const selectedWaste = useActivityManagerStore((s) => s.selectedWaste);

  const { goBack } = useNavigation();
  const showToast = useShowToast();

  const { data, errorMessage, isLoading, isError } = useAsyncData(
    async () =>
      selectedWaste && (await fetchWastePhotoURL(selectedWaste.photo)),
  );

  const parsedWeight = Number(weight);
  const isWeightValid =
    weight.trim() !== "" && !Number.isNaN(parsedWeight) && parsedWeight > 0;

  const handleVerify = async () => {
    if (!selectedWaste) return;

    if (!isWeightValid) {
      showToast({ title: "Masukkan berat sampah yang valid" });
      return;
    }

    setSubmitting(true);
    try {
      await updateWasteBank(selectedWaste.id, { weight: parsedWeight });
      setVerifyDialogShown(false);
      showToast({ title: "Bank sampah berhasil diverifikasi" });
      goBack();
    } catch (e) {
      const { uiMessage } = normalizeError(e, "Waste Bank Verify");
      showToast({ title: uiMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedWaste) return;

    setSubmitting(true);
    try {
      await deleteWasteBank(selectedWaste.id);
      setRejectDialogShown(false);
      showToast({ title: "Bank sampah ditolak" });
      goBack();
    } catch (e) {
      const { uiMessage } = normalizeError(e, "Waste Bank Reject");
      showToast({ title: uiMessage });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedWaste) goBack();
  }, [selectedWaste]);

  if (!selectedWaste) return null;

  return (
    <Screen
      requiredInternet
      headerComponent={
        <ScreenHeader
          title="Verifikasi bank sampah"
          leftComponent={<BackButton />}
        />
      }
      overlayComponent={
        <>
          <Modal
            isOpen={verifyDialogShown}
            onClose={() => setVerifyDialogShown(false)}
            title="Verifikasi bank sampah"
            description={`Apakah anda sudah yakin ingin verifikasi berat sampah sebesar ${weight || 0} kg?`}
            contentComponent={
              <>
                <Button
                  isDisabled={isSubmitting}
                  label="Batalkan"
                  variant="outline"
                  onPress={() => setVerifyDialogShown(false)}
                />

                <Button
                  isLoading={isSubmitting}
                  label="Verifikasi"
                  onPress={handleVerify}
                />
              </>
            }
          />

          <Modal
            isOpen={rejectDialogShown}
            onClose={() => setRejectDialogShown(false)}
            title="Tolak bank sampah"
            description="Kegiatan ini akan ditolak dan siswa perlu mengirim ulang. Tindakan ini tidak dapat dibatalkan."
            contentComponent={
              <>
                <Button
                  isDisabled={isSubmitting}
                  label="Batalkan"
                  variant="outline"
                  onPress={() => setRejectDialogShown(false)}
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
                onPress={() => setRejectDialogShown(true)}
              />

              <Button
                label="Verifikasi"
                fill
                size="cta"
                variant="default"
                isDisabled={!isWeightValid}
                onPress={() => setVerifyDialogShown(true)}
              />
            </HStack>
          </BottomPanel>
        </>
      }
      contentComponent={
        <>
          {selectedWaste.photo && (
            <Box className="w-full h-64 bg-accent-foreground/20 rounded-md overflow-hidden">
              {isLoading && (
                <Center className="aboslute w-full h-full">
                  <ActivityIndicator />
                </Center>
              )}

              {isError && !isLoading && (
                <Center className="aboslute w-full h-full gap-4">
                  <Icon as={Info} className="size-16" />
                  <Text size="lg" className="max-w-[60%] text-center">
                    {errorMessage}
                  </Text>
                </Center>
              )}

              <Image
                contentFit="cover"
                style={{ position: "absolute", inset: 0 }}
                source={`${data}`}
              />
            </Box>
          )}

          <ListSection title="Berat sampah (kg)">
            <TextField
              placeholder="0"
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
