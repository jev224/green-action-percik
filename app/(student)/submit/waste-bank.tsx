import { Leaf, Recycle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivitySubmittedScreen, BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ListSection,
	PhotoPicker,
	Screen,
	ScreenHeader,
	SegmentedControl,
	Spacer,
} from "@/components/primitives";
import { useResultScreen } from "@/hooks/useResultScreen";
import { useShowToast } from "@/hooks/useShowToast";
import { useUserProfile } from "@/hooks/useUser";
import {
	deleteSubmittedWasteActivity,
	isWasteActivitySubmitted,
	submitWasteActivity,
} from "@/services/fetcher/students/submission";
import { ServerError } from "@/services/ServerError";

export default function WasteSubmissionScreen() {
	const { profile } = useUserProfile("student");

	const [wasteType, setWasteType] = useState("organic");
	const [activityPhotoUri, setActivityPhotoUri] = useState<string | null>(null);

	const [isLoading, setLoading] = useState<boolean>(false);
	const [initialLoading, setInitialLoading] = useState<boolean>(false);
	const [alreadySubmitted, setSubmitted] = useState<boolean>(false);

	const showToast = useShowToast();
	const { showResult } = useResultScreen();

	const isFulfilled = activityPhotoUri;

	const handleSubmit = async () => {
		if (!isFulfilled) {
			showToast({
				title: "Yuk lengkapi semua kolom yang wajib diisi",
			});
			return;
		}

		setLoading(true);

		try {
			if (!profile) return;

			await submitWasteActivity(
				profile.id,
				profile.user_id,
				profile.name,
				profile.class,
				wasteType,
				activityPhotoUri,
			);

			showResult({
				type: "success",
				title: "Pengumpulan sampah berhasil dikirim",
				subtitle:
					"Kegiatan pengumpulan sampah kamu sudah tercatat untuk hari ini",
			});
		} catch (e) {
			if (e instanceof ServerError) {
				showToast({ title: e.ui_message });
				console.log("Waste Bank Submission", `[${e.status}]:`, e.message);
			} else {
				showToast({ title: "Terjadi kesalahan. Coba lagi" });
				console.log("Waste Bank Submission", e);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			if (!profile) return;
			setLoading(true);

			await deleteSubmittedWasteActivity(profile.user_id);
			setSubmitted(false);
		} catch (e) {
			if (e instanceof ServerError) {
				showToast({ title: e.ui_message });
			} else {
				showToast({ title: "Terjadi kesalahan. Coba lagi" });
			}

			console.log("Waste Bank Deletion", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		async function run() {
			setInitialLoading(true);

			try {
				if (!profile) return;
				const result = await isWasteActivitySubmitted(profile.user_id);
				setSubmitted(result.submitted);
			} catch (e) {
				if (e instanceof ServerError) {
					showToast({ title: e.ui_message });
				}

				console.log("Waste Bank Checker", e);
			} finally {
				setInitialLoading(false);
			}
		}

		run();
	}, [profile]);

	return alreadySubmitted ? (
		<ActivitySubmittedScreen
			initialLoading={initialLoading}
			isLoading={isLoading}
			onDelete={handleDelete}
			message="Kamu sudah mengirim kegiatan pengumpulan sampah hari ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
		/>
	) : (
		<Screen
			requiredInternet
			scrollable
			isLoading={initialLoading}
			headerComponent={
				<ScreenHeader
					title="Pengumpulan Sampah"
					leftComponent={<BackButton />}
				/>
			}
			overlayComponent={
				<BottomPanel variant="ghost">
					<Button
						size="cta"
						label="Kirim"
						isLoading={isLoading}
						onPress={handleSubmit}
						isDisabled={initialLoading}
					/>
				</BottomPanel>
			}
			contentComponent={
				<>
					<ListSection title="Jenis sampah">
						<SegmentedControl
							options={[
								{
									label: "Organik",
									value: "organic",
									icon: Leaf,
								},
								{
									label: "An-Organik",
									value: "anorganic",
									icon: Recycle,
								},
							]}
							value={wasteType}
							onChange={setWasteType}
						/>
					</ListSection>

					<ListSection title="Foto bukti sampah">
						<PhotoPicker
							value={activityPhotoUri}
							onChange={setActivityPhotoUri}
						/>
					</ListSection>

					<Spacer height={108} />
				</>
			}
		/>
	);
}
