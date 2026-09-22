import { Redirect } from "expo-router";
import { Apple, BrushCleaning, Bubbles, Medal } from "lucide-react-native";
import { useEffect } from "react";
import { BackButton, ProfileHeader } from "@/components/domain";
import {
	ListSection,
	Screen,
	ScreenHeader,
	StatCard,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import { fetchStudentStatistics } from "@/services/fetcher/student/studentDashboard";
import { fetchStudentProfile } from "@/services/fetcher/student/studentQuery";
import { useStudentActionStore } from "@/stores/studentOverview";
import { parseProfileInfo } from "@/utils";

export default function StudentOverviewScreen() {
	const showToast = useShowToast();
	const { goBack } = useNavigation();

	const studentData = useStudentActionStore((state) => state.studentData);

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
		}
	}, [isLoading, data, errorMessage, isError]);

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
			// overlayComponent={
			//   <BottomPanel variant="ghost">
			//     <HStack space="md">
			//       <Button label="Edit" fill size="cta" />
			//     </HStack>
			//   </BottomPanel>
			// }
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
								stats={`${wasteWeightTotal} kg`}
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
				</>
			)}
		/>
	);
}
