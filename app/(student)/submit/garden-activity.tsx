import { useState } from "react";

import { ActivitySubmissionScreen } from "@/components/domain";
import {
	ListSection,
	PhotoPicker,
	SelectField,
	Spacer,
} from "@/components/primitives";
import { useActivitySubmission } from "@/hooks/useActivitySubmission";
import { useUserProfile } from "@/hooks/useUser";
import {
	deleteSubmittedGardenActivity,
	isGardenActivitySubmitted,
	submitGardenActivity,
} from "@/services/fetcher/students/submission";

export default function CompostSubmissionScreen() {
	const { profile } = useUserProfile("student");

	const [activityType, setActivityType] = useState<string>("");
	const [activityLocation, setActivityLocation] = useState<string>("");
	const [activityPhotoUri, setActivityPhotoUri] = useState<string | null>(null);

	const {
		initialLoading,
		isLoading,
		submittedInfo,
		handleDelete,
		handleSubmit,
	} = useActivitySubmission(
		{
			checkEnabled: !!profile,

			checkSubmitted: async () => {
				if (!profile) throw new Error("Profile not loaded");
				return await isGardenActivitySubmitted(profile.user_id);
			},

			deleteSubmission: async () => {
				if (!profile) throw new Error("Profile not loaded");
				await deleteSubmittedGardenActivity(profile.user_id);
			},

			submit: async () => {
				if (!profile) throw new Error("Profile not loaded");
				if (!activityPhotoUri) throw new Error("Missing activity photo");
				await submitGardenActivity(
					profile.id,
					profile.user_id,
					profile.name,
					profile.class,
					activityType,
					activityLocation,
					activityPhotoUri,
				);
			},

			isFulfilled: !!activityPhotoUri && !!activityLocation && !!activityType,

			incompleteMessage: "Yuk lengkapi semua kolom yang wajib diisi",

			successMessage: {
				title: "Kegiatan kebun berhasil dikirim",
				subtitle: "Kegiatan kebun kamu sudah tercatat untuk hari ini",
			},

			logLabel: "Garden Activity",
		},
		[profile],
	);

	return (
		<ActivitySubmissionScreen
			title="Perawatan Tanaman"
			initialLoading={initialLoading}
			isLoading={isLoading}
			submitted={!!submittedInfo?.submitted}
			onSubmit={handleSubmit}
			onDelete={handleDelete}
			submittedMessage="Kamu sudah mengirim kegiatan perawatan Tanaman hari ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
		>
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
				<PhotoPicker value={activityPhotoUri} onChange={setActivityPhotoUri} />
			</ListSection>

			<Spacer height={108} />
		</ActivitySubmissionScreen>
	);
}
