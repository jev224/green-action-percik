import { useEffect, useState } from "react";

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
import { useNavigation } from "@/hooks/useNavigation";
import { useUserProfile } from "@/hooks/useUser";
import {
	deleteSubmittedCompostActivity,
	isCompostActivitySubmitted,
	submitCompostActivity,
} from "@/services/fetcher/activity/compostActivity";
import { fetchStudentsByClass } from "@/services/fetcher/student/studentQuery";
import { useActivityManagerStore } from "@/stores/activityManager";

type Student = { user_id: string };

export default function CompostSubmissionScreen() {
	const { profile } = useUserProfile("teacher");
	const selectedClass = useActivityManagerStore((s) => s.selectedClass);
	const { goBack } = useNavigation();

	const { isLoading: activityInfoLoading, locations } =
		useActivityInfo("locations");

	const {
		data: students,
		errorMessage,
		isLoading: isFetchLaoding,
		refresh,
	} = useAsyncData(
		async () => selectedClass && (await fetchStudentsByClass(selectedClass.id)),
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
			checkEnabled: !!profile && !!selectedClass,

			checkSubmitted: async () => {
				if (!profile) throw new Error("Profile not loaded");
				if (!selectedClass) throw new Error("Class not found");
				return await isCompostActivitySubmitted(selectedClass.id);
			},

			deleteSubmission: async () => {
				if (!profile) throw new Error("Profile not loaded");
				if (!selectedClass) throw new Error("Class not found");
				await deleteSubmittedCompostActivity(selectedClass.id);
			},

			submit: async () => {
				if (!profile) throw new Error("Profile not loaded");
				if (!students) throw new Error("Students not loaded");
				if (!activityPhotoUri) throw new Error("Missing activity photo");
				if (!selectedClass) throw new Error("Class not found");
				await submitCompostActivity(
					"student",
					profile.user_id,
					selectedClass.id,
					selectedClass,
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
		[profile, selectedClass],
	);

	const isByMe =
		submittedInfo && profile && submittedInfo.submittedBy === profile.user_id;

	useEffect(() => {
		if (!selectedClass) goBack();
	}, [selectedClass]);

	if (!selectedClass) return null;

	return (
		<ActivitySubmissionScreen
			title="Laporan Kompos"
			initialLoading={initialLoading}
			isLoading={isLoading}
			submitted={!!submittedInfo?.submitted}
			onSubmit={handleSubmit}
			onDelete={handleDelete}
			submittedMessage={
				isByMe
					? "Anda sudah mengirim kegiatan kompos bulan ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
					: `Kegiatan kompos sudah kirim oleh ${submittedInfo?.submittedAuthor ?? "Seseorang"} pada bulan ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama.`
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
