import { useState } from "react";

import {
	ActivitySubmissionScreen,
	StudentMultiSelect,
} from "@/components/domain";
import {
	ListSection,
	PhotoPicker,
	SelectField,
	Spacer,
} from "@/components/primitives";
import { useActivityInfo } from "@/hooks/useActivityInfo";
import { useActivitySubmission } from "@/hooks/useActivitySubmission";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useUserProfile } from "@/hooks/useUser";
import {
	deleteSubmittedCompostActivity,
	isCompostActivitySubmitted,
	submitCompostActivity,
} from "@/services/fetcher/activity/compostActivity";
import { fetchStudentsByClass } from "@/services/fetcher/student/studentQuery";

type Student = { user_id: string };

export default function CompostSubmissionScreen() {
	const userProfile = useUserProfile("student");
	const { profile } = userProfile;

	const { isLoading: activityInfoLoading, locations } =
		useActivityInfo("locations");

	const {
		data: students,
		errorMessage,
		isLoading: isFetchLaoding,
		refresh,
	} = useAsyncData(
		async (profile) =>
			profile && (await fetchStudentsByClass(profile.class_id)),
		userProfile,
	);

	const [activityLocation, setActivityLocation] = useState<string>("");
	const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
	const [activityPhotoUri, setActivityPhotoUri] = useState<string | null>(null);

	const {
		initialLoading,
		isLoading,
		submittedInfo,
		handleDelete,
		handleSubmit,
	} = useActivitySubmission(
		{
			isAnotherLoading: activityInfoLoading,

			checkEnabled: !!userProfile.profile && !!students,

			checkSubmitted: async () => {
				if (!profile) throw new Error("Profile not loaded");
				return await isCompostActivitySubmitted(profile.class_id);
			},

			deleteSubmission: async () => {
				if (!profile) throw new Error("Profile not loaded");
				await deleteSubmittedCompostActivity(profile.class_id);
			},

			submit: async () => {
				if (!profile) throw new Error("Profile not loaded");
				if (!students) throw new Error("Students not loaded");
				if (!activityPhotoUri) throw new Error("Missing activity photo");
				await submitCompostActivity(
					"student",
					profile.user_id,
					profile.class_id,
					profile.class,
					activityPhotoUri,
					students.map(({ user_id }) => user_id),
					selectedStudents.map(({ user_id }) => user_id),
				);
			},

			isFulfilled: !!activityPhotoUri && !!activityLocation,

			incompleteMessage: "Yuk lengkapi semua kolom yang wajib diisi",

			successMessage: {
				title: "Kegiatan kompos berhasil dikirim",
				subtitle: "Kegiatan kompos kamu sudah tercatat untuk hari ini",
			},

			logLabel: "Compost Activity",
		},
		[profile],
	);

	const isByMe =
		submittedInfo &&
		userProfile.profile &&
		submittedInfo.submittedBy === userProfile.profile.user_id;

	return (
		<ActivitySubmissionScreen
			title="Laporan Kompos"
			initialLoading={initialLoading}
			isLoading={isLoading}
			submitted={!!submittedInfo?.submitted}
			onSubmit={handleSubmit}
			onDelete={isByMe ? handleDelete : undefined}
			submittedMessage={
				isByMe
					? "Kamu sudah mengirim kegiatan kompos bulan ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
					: `Kegiatan kompos sudah kirim oleh ${submittedInfo?.submittedAuthor || "Seseorang"} pada bulan ini. Minta ${submittedInfo?.submittedAuthor || "dia"} jika ingin mengubah pengiriman, atau kembali ke halaman utama.`
			}
		>
			<ListSection title="Lokasi Kegiatan">
				<SelectField
					placeholder="Pilih Lokasi"
					options={locations}
					value={activityLocation}
					onValueChange={setActivityLocation}
				/>
			</ListSection>

			<ListSection title="Siswa Hadir">
				<StudentMultiSelect
					onRefresh={refresh}
					errorMessage={errorMessage}
					isLoading={isFetchLaoding}
					studentsRes={students}
					onSelectionChange={setSelectedStudents}
				/>
			</ListSection>

			<ListSection title="Foto Kegiatan">
				<PhotoPicker value={activityPhotoUri} onChange={setActivityPhotoUri} />
			</ListSection>

			<Spacer height={108} />
		</ActivitySubmissionScreen>
	);
}
