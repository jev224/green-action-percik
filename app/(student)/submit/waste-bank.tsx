import { Leaf, Recycle } from "lucide-react-native";
import { useState } from "react";
import { ActivitySubmissionScreen } from "@/components/domain";
import {
	ListSection,
	PhotoPicker,
	SegmentedControl,
	Spacer,
} from "@/components/primitives";
import { useActivitySubmission } from "@/hooks/useActivitySubmission";
import { useUserProfile } from "@/hooks/useUser";
import {
	deleteSubmittedWasteActivity,
	isWasteActivitySubmitted,
	submitWasteActivity,
} from "@/services/fetcher/activity/studentActivitySubmission";

export default function WasteSubmissionScreen() {
	const { profile } = useUserProfile("student");

	const [wasteType, setWasteType] = useState("organic");
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
				return await isWasteActivitySubmitted(profile.user_id);
			},

			deleteSubmission: async () => {
				if (!profile) throw new Error("Profile not loaded");
				await deleteSubmittedWasteActivity(profile.user_id);
			},

			submit: async () => {
				if (!profile) throw new Error("Profile not loaded");
				if (!activityPhotoUri) throw new Error("Missing activity photo");

				await submitWasteActivity(
					profile.id,
					profile.user_id,
					profile.name,
					profile.class,
					wasteType,
					activityPhotoUri,
				);
			},

			isFulfilled: !!activityPhotoUri,

			incompleteMessage: "Yuk lengkapi semua kolom yang wajib diisi",

			successMessage: {
				title: "Pengumpulan sampah berhasil dikirim",
				subtitle:
					"Kegiatan pengumpulan sampah kamu sudah tercatat untuk hari ini",
			},

			logLabel: "Waste Activity",
		},
		[profile],
	);

	return (
		<ActivitySubmissionScreen
			title="Pengumpulan Sampah"
			initialLoading={initialLoading}
			isLoading={isLoading}
			submitted={!!submittedInfo?.submitted}
			onSubmit={handleSubmit}
			onDelete={handleDelete}
			submittedMessage="Kamu sudah mengirim kegiatan pengumpulan sampah hari ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
		>
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
				<PhotoPicker value={activityPhotoUri} onChange={setActivityPhotoUri} />
			</ListSection>

			<Spacer height={108} />
		</ActivitySubmissionScreen>
	);
}
