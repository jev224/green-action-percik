import { useEffect, useState } from "react";
import { BackButton } from "@/components/domain";
import { Button, Modal, Screen, ScreenHeader } from "@/components/primitives";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import {
	fetchUnpaidStudentWaste,
	payAllUnpaidStudentWaste,
} from "@/services/fetcher/activity/teacherActivityManager";
import { useActivityManagerStore } from "@/stores/activityManager";
import { formatPrice, normalizeError } from "@/utils";

export default function DebtSettlementScreen() {
	const { goBack } = useNavigation();
	const showToast = useShowToast();

	const selectedStudent = useActivityManagerStore((s) => s.selectedStudent);

	const [isSubmitting, setSubmitting] = useState(false);
	const [confirmDialogShown, setConfirmDialogShown] = useState(false);

	const { data, isError, isLoading, errorMessage, refresh } = useAsyncData(
		async () =>
			selectedStudent?.user_id
				? await fetchUnpaidStudentWaste(selectedStudent.user_id)
				: undefined,
	);

	const totalDebt = data ?? 0;

	useEffect(() => {
		if (!selectedStudent) {
			showToast({ title: "Data siswa tidak ditemukan" });
			goBack();
		}
	}, [selectedStudent, showToast, goBack]);

	const handleSubmit = async () => {
		if (!selectedStudent?.user_id) return;

		setSubmitting(true);
		try {
			await payAllUnpaidStudentWaste(selectedStudent.user_id);
			setConfirmDialogShown(false);
			showToast({ title: "Uang berhasil dicatat sebagai sudah diberikan" });
			goBack();
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Pay unpaid student waste");
			showToast({ title: uiMessage });
		} finally {
			setSubmitting(false);
		}
	};

	if (!selectedStudent) return null;

	return (
		<Screen
			requiredInternet
			isError={isError}
			errorMessage={errorMessage}
			onTryAgain={refresh}
			isLoading={isLoading}
			headerComponent={
				<ScreenHeader
					title="Catat Pemberian Uang"
					leftComponent={<BackButton />}
				/>
			}
			overlayComponent={
				<Modal
					isOpen={confirmDialogShown}
					onClose={() => setConfirmDialogShown(false)}
					title="Apakah Anda yakin?"
					description={
						`Pastikan Anda sudah memberikan uang sebesar Rp${formatPrice(totalDebt)} kepada siswa. ` +
						"Setelah dikonfirmasi, data ini akan ditandai sebagai sudah diberikan dan tidak dapat diubah kembali. " +
						"Jika terjadi kesalahan, segera hubungi admin untuk mengubah data."
					}
					contentComponent={
						<>
							<Button
								isDisabled={isSubmitting}
								label="Batalkan"
								variant="outline"
								onPress={() => setConfirmDialogShown(false)}
							/>
							<Button
								isLoading={isSubmitting}
								label="Ya, sudah"
								onPress={handleSubmit}
							/>
						</>
					}
				/>
			}
			contentComponent={
				<>
					<Center className="flex-1">
						<Center className="w-[70%] max-w-98 aspect-square rounded-full bg-primary/10">
							<Center className="w-[82%] h-[82%] rounded-full bg-card border-8 border-primary/20">
								<Heading size="4xl">{`Rp${formatPrice(totalDebt)}`}</Heading>
							</Center>
						</Center>
					</Center>

					<Button
						label="Catat"
						size="cta"
						variant="default"
						isDisabled={isSubmitting}
						onPress={() => setConfirmDialogShown(true)}
					/>
				</>
			}
		/>
	);
}
