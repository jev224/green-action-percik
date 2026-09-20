import { useEffect, useState } from "react";

import { ActivitySubmittedScreen, BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ListSection,
	PhotoPicker,
	Screen,
	ScreenHeader,
	SelectField,
	Spacer,
} from "@/components/primitives";
import { useResultScreen } from "@/hooks/useResultScreen";
import { useShowToast } from "@/hooks/useShowToast";
import { useUserProfile } from "@/hooks/useUser";
import {
	deleteSubmittedGardenActivity,
	isGardenActivitySubmitted,
	submitGardenActivity,
} from "@/services/fetcher/students/submission";
import { ServerError } from "@/services/ServerError";

export default function CompostSubmissionScreen() {
	const { profile } = useUserProfile("student");

	const [activityType, setActivityType] = useState<string>("");
	const [activityLocation, setActivityLocation] = useState<string>("");
	const [activityPhotoUri, setActivityPhotoUri] = useState<string | null>(null);

	const [isLoading, setLoading] = useState<boolean>(false);
	const [initialLoading, setInitialLoading] = useState<boolean>(false);
	const [alreadySubmitted, setSubmitted] = useState<boolean>(false);

	const showToast = useShowToast();
	const { showResult } = useResultScreen();

	const isFulfilled =
		!!activityPhotoUri && !!activityLocation && !!activityType;

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

			await submitGardenActivity(
				profile.id,
				profile.user_id,
				profile.name,
				profile.class,
				activityType,
				activityLocation,
				activityPhotoUri,
			);

			showResult({
				type: "success",
				title: "Kegiatan kebun berhasil dikirim",
				subtitle: "Kegiatan kebun kamu sudah tercatat untuk hari ini",
			});
		} catch (e) {
			if (e instanceof ServerError) {
				showToast({ title: e.ui_message });
				console.log(
					"Garden activity Submission ",
					`[${e.status}]: `,
					e.message,
				);
			} else {
				showToast({ title: "Terjadi kesalahan. Coba lagi" });
				console.log("Garden activity Submission", e);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			if (!profile) return;
			setLoading(true);

			await deleteSubmittedGardenActivity(profile.user_id);
			setSubmitted(false);
		} catch (e) {
			if (e instanceof ServerError) {
				showToast({ title: e.ui_message });
			} else {
				showToast({ title: "Terjadi kesalahan. Coba lagi" });
			}

			console.log("Garden activity Deletion", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		async function run() {
			setInitialLoading(true);

			try {
				if (!profile) return;
				const result = await isGardenActivitySubmitted(profile.user_id);
				setSubmitted(result.submitted);
			} catch (e) {
				if (e instanceof ServerError) {
					showToast({ title: e.ui_message });
				}

				console.log("Compost activity Checker", e);
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
			message="Kamu sudah mengirim kegiatan perawatan Tanaman hari ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
		/>
	) : (
		<Screen
			scrollable
			requiredInternet
			isLoading={initialLoading}
			headerComponent={
				<ScreenHeader
					title="Perawatan Tanaman"
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
					<ListSection title="Jenis Kegiatan">
						<SelectField
							placeholder="Pilih Kegiatan"
							options={[
								{ label: "Menyiram tanaman", value: "Menyiram tanaman" },
								{ label: "Memberi makan ikan", value: "Memberi makan ikan" },
							]}
							value={activityType}
							onValueChange={setActivityType}
						/>
					</ListSection>

					<ListSection title="Lokasi Kegiatan">
						<SelectField
							placeholder="Pilih Lokasi"
							options={[
								{ label: "Pendopo", value: "pendopo" },
								{ label: "Lapangan", value: "lapangan" },
							]}
							value={activityLocation}
							onValueChange={setActivityLocation}
						/>
					</ListSection>

					<ListSection title="Foto Kegiatan">
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
