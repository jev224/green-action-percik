import { Redirect } from "expo-router";
import {
	Apple,
	BrushCleaning,
	Bubbles,
	Medal,
	Trash2,
	Users,
} from "lucide-react-native";
import { useEffect } from "react";
import { BackButton, ProfileHeader } from "@/components/domain";
import {
	ActionTile,
	ListSection,
	Screen,
	ScreenHeader,
	StatCard,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { refreshOnNextNavigate } from "@/hooks/useRefreshOnNavigate";
import { useShowToast } from "@/hooks/useShowToast";
import { fetchStudentStatistics } from "@/services/fetcher/student/studentDashboard";
import { fetchStudentProfile } from "@/services/fetcher/student/studentQuery";
import { useStudentActionStore } from "@/stores/studentOverview";
import { formatCompactNumber, parseProfileInfo } from "@/utils";

export default function StudentOverviewScreen() {
	const showToast = useShowToast();
	const { goBack, navigateTo } = useNavigation();

	const studentData = useStudentActionStore((state) => state.studentData);
	const setStudentProfile = useStudentActionStore(
		(state) => state.setStudentProfile,
	);

	const { data, isLoading, isError, errorMessage } = useAsyncData(
		async () => {
			if (!studentData) return null;

			const [profile, stats] = await Promise.all([
				fetchStudentProfile(studentData.userId),
				fetchStudentStatistics(studentData.userId),
			]);

			return { profile, stats };
		},
		undefined,
		[studentData?.userId],
	);

	useEffect(() => {
		if (isError) {
			showToast({ title: errorMessage });
			goBack("/(teacher)/(tabs)/home");
			return;
		}

		if (!isLoading && !data) {
			showToast({ title: "Data siswa tidak ditemukan" });
			goBack("/(teacher)/(tabs)/home");
			return;
		}

		refreshOnNextNavigate();
	}, [isLoading, data, errorMessage, isError]);

	useEffect(() => {
		if (data?.profile) setStudentProfile(data.profile);
	}, [data, setStudentProfile]);

	if (!isLoading && !data) {
		return <Redirect href={"/(teacher)/(tabs)/students"} />;
	}

	return (
		<Screen
			scrollable
			isLoading={isLoading}
			isError={isError}
			data={data}
			headerComponent={
				<ScreenHeader title="Detail Siswa" leftComponent={<BackButton />} />
			}
			contentComponent={({
				stats: {
					wasteWeightTotal,
					gardenActivityCount,
					compostActivityCount,
					studentPoints,
				},
				profile: { name, nis, class: classData },
			}) => (
				<>
					<ProfileHeader
						layout="row"
						size="md"
						name={name}
						role={{
							type: "student",
							nis,
							info: parseProfileInfo({ role: "student", ...classData }),
						}}
					/>

					<ListSection title="Poin Siswa">
						<StatCard
							title="Poin"
							stats={studentPoints}
							color="warning"
							size="lg"
							icon={Medal}
							// variant="outline"
						/>
					</ListSection>

					<ListSection title="Statistik siswa">
						<HStack space="md">
							<StatCard
								title="Sampah"
								stats={`${formatCompactNumber(wasteWeightTotal)} kg`}
								icon={Bubbles}
								variant="outline"
								fill
							/>
							<StatCard
								title="Perawatan"
								stats={`${gardenActivityCount} Kali`}
								icon={BrushCleaning}
								variant="outline"
								fill
							/>
							<StatCard
								title="Kompos"
								stats={`${compostActivityCount} Kali`}
								icon={Apple}
								variant="outline"
								fill
							/>
						</HStack>
					</ListSection>

					<ListSection title="Aksi Siswa">
						<ActionTile
							title="Riwayat bank sampah"
							description="Lihat riwayat bank sampah dan jumlah sampah yang telah dikumpulkan."
							icon={Trash2}
							variant="solid"
							thumbnailPosition="left"
							onPress={() => navigateTo("/(teacher)/student/wastebank-history")}
						/>

						<ActionTile
							title="Kelola data siswa"
							description="Lihat dan ubah informasi serta data siswa."
							icon={Users}
							variant="solid"
							thumbnailPosition="left"
							onPress={() => navigateTo("/(teacher)/student/edit-profile")}
						/>
					</ListSection>
				</>
			)}
		/>
	);
}
