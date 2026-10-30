import { useEffect, useState } from "react";
import { BackButton } from "@/components/domain";
import {
	Button,
	ListSection,
	Screen,
	ScreenHeader,
	SelectField,
	TextField,
} from "@/components/primitives";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { refreshOnNextNavigate } from "@/hooks/useRefreshOnNavigate";
import { useShowToast } from "@/hooks/useShowToast";
import { fetchAllStudentClasses } from "@/services/fetcher/student/studentClass";
import { updateStudentData } from "@/services/fetcher/student/studentData";
import { useStudentActionStore } from "@/stores/studentOverview";
import { normalizeError, parseClassName } from "@/utils";

const isDigits = (v: string) => /^\d+$/.test(v);

export default function EditStudentProfileScreen() {
	const showToast = useShowToast();
	const { goBack } = useNavigation();

	const studentProfile = useStudentActionStore((s) => s.studentProfile);

	const {
		data: classes,
		isLoading,
		isError,
		refresh,
		errorMessage,
	} = useAsyncData(fetchAllStudentClasses);

	const [name, setName] = useState(studentProfile?.name ?? "");
	const [username, setUsername] = useState(studentProfile?.username ?? "");
	const [nis, setNis] = useState(String(studentProfile?.nis ?? ""));
	const [npsn, setNpsn] = useState(String(studentProfile?.npsn ?? ""));
	const [points, setPoints] = useState(String(studentProfile?.points ?? 0));
	const [classId, setClassId] = useState(
		String(studentProfile?.class_id ?? ""),
	);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!studentProfile) {
			showToast({ title: "Data tidak valid" });
			goBack();
			refreshOnNextNavigate();
		}
	}, [studentProfile, goBack, showToast]);

	if (!studentProfile) return null;

	const handleSave = async () => {
		const error = !name.trim()
			? "Nama tidak boleh kosong"
			: !username.trim()
				? "Username tidak boleh kosong"
				: !isDigits(nis)
					? "NIS harus berupa angka"
					: npsn && !isDigits(npsn)
						? "NPSN harus berupa angka"
						: !isDigits(points)
							? "Poin harus berupa angka bulat"
							: !classId
								? "Kelas harus dipilih"
								: null;

		if (error) {
			showToast({ title: error });
			return;
		}

		setIsSaving(true);

		try {
			await updateStudentData(studentProfile.user_id, {
				name: name.trim(),
				username: username.trim(),
				nis: Number(nis),
				npsn: npsn ? Number(npsn) : null,
				points: Number(points),
				class_id: Number(classId),
			});

			showToast({ title: "Profil berhasil diperbarui" });
			goBack();
			refreshOnNextNavigate();
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Student Profile Update");
			showToast({ title: uiMessage });
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Screen
			scrollable
			isLoading={isLoading}
			isError={isError}
			errorMessage={errorMessage}
			onTryAgain={refresh}
			requiredInternet
			space="lg"
			headerComponent={
				<ScreenHeader
					title="Edit Profil Siswa"
					leftComponent={<BackButton />}
				/>
			}
			contentComponent={
				<>
					<ListSection title="Nama" space="sm" size="sm">
						<TextField
							value={name}
							onChangeText={setName}
							placeholder="masukkan nama siswa"
						/>
					</ListSection>

					<ListSection title="Username" space="sm" size="sm">
						<TextField
							value={username}
							onChangeText={setUsername}
							placeholder="masukkan username"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</ListSection>

					<ListSection title="NIS" space="sm" size="sm">
						<TextField
							value={nis}
							onChangeText={setNis}
							placeholder="masukkan nis"
							keyboardType="numeric"
						/>
					</ListSection>

					<ListSection title="NPSN (opsional)" space="sm" size="sm">
						<TextField
							value={npsn}
							onChangeText={setNpsn}
							placeholder="masukkan npsn"
							keyboardType="numeric"
						/>
					</ListSection>

					<ListSection title="Poin" space="sm" size="sm">
						<TextField
							value={points}
							onChangeText={setPoints}
							placeholder="masukkan poin"
							keyboardType="numeric"
						/>
					</ListSection>

					<ListSection title="Kelas" space="sm" size="sm">
						<SelectField
							value={classId}
							onValueChange={setClassId}
							options={(classes ?? []).map((classData) => ({
								label: parseClassName(classData),
								value: classData.id.toString(),
							}))}
						/>
					</ListSection>

					<Button
						label="Simpan perubahan"
						onPress={handleSave}
						disabled={isSaving}
						className="mt-4"
					/>
				</>
			}
		/>
	);
}
