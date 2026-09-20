import {
	Apple,
	BrushCleaning,
	Bubbles,
	Coins,
	GraduationCap,
	Recycle,
	Trash2,
} from "lucide-react-native";
import { Greeting } from "@/components/domain";
import {
	ActionTile,
	ListSection,
	Screen,
	StatCard,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useUserProfile } from "@/hooks/useUser";
import { fetchTeacherDashboardStats } from "@/services/fetcher/teacher/dashboard";
import { useActivityManagerStore } from "@/stores/activityManager";
import { parseProfileInfo } from "@/utils";

export default function HomeScreen() {
	const { setActivityType } = useActivityManagerStore();
	const { navigateTo } = useNavigation();

	const userProfile = useUserProfile("teacher");

	const { data, isLoading, isError, refresh, errorMessage, isRefreshing } =
		useAsyncData(
			async (profile) =>
				profile && { stats: await fetchTeacherDashboardStats(), profile },

			userProfile,
		);

	return (
		<Screen
			scrollable
			isLoading={isLoading}
			isError={isError}
			data={data}
			errorMessage={errorMessage}
			onRefresh={refresh}
			onTryAgain={refresh}
			requiredInternet
			isRefreshing={isRefreshing}
			contentComponent={({
				stats: {
					studentCount,
					studentPoinTotal,
					wasteWeightTotal,
					gardenActivityCount,
					compostActivityCount,
				},
				profile: { name, major },
			}) => (
				<>
					<Greeting
						name={name}
						info={parseProfileInfo({ role: "teacher", major })}
					/>

					<HStack space="md">
						<StatCard
							title="Siswa"
							stats={studentCount}
							icon={GraduationCap}
							thumbnailRotation={-12}
							animation="fun"
							fill
							size="md"
							color="info"
							variant="outline"
						/>

						<StatCard
							title="Poin"
							stats={studentPoinTotal}
							icon={Coins}
							fill
							animation="fun"
							size="md"
						/>
					</HStack>

					<ListSection title="Statistik saat ini">
						<HStack space="md">
							<StatCard
								title="Sampah"
								stats={`${wasteWeightTotal} kg`}
								icon={Bubbles}
								variant="outline"
								fill
								animation="fun"
								color="organic"
							/>

							<StatCard
								title="Perawatan"
								stats={`${gardenActivityCount} Kali`}
								icon={BrushCleaning}
								variant="outline"
								fill
								animation="fun"
							/>

							<StatCard
								title="Kompos"
								stats={`${compostActivityCount} Kali`}
								icon={Apple}
								variant="outline"
								fill
								animation="fun"
								color="inorganic"
							/>
						</HStack>
					</ListSection>

					<ListSection title="Kelola aktivitas">
						<VStack space="md">
							<ActionTile
								title="Verifikasi berat sampah"
								description="Periksa dan konfirmasi berat sampah siswa"
								icon={Trash2}
								variant="solid"
								thumbnailPosition="right"
								onPress={() => {
									setActivityType("waste-bank");
									navigateTo("/(teacher)/activity-manager/activity-list");
								}}
							/>

							<ActionTile
								title="Kelola kegiatan kompos"
								description="Pantau dan kelola kegiatan kompos kelas"
								icon={Recycle}
								variant="solid"
								thumbnailPosition="right"
								onPress={() => {
									setActivityType("compost-activity");
									navigateTo("/(teacher)/activity-manager/activity-list");
								}}
							/>
						</VStack>
					</ListSection>
				</>
			)}
			loadingComponent={
				<>
					<HStack className="w-full justify-between items-center">
						<VStack space="sm">
							<SkeletonText className="w-48 h-5" />
							<SkeletonText className="w-32 h-5" />
						</VStack>

						<Skeleton className="aspect-square w-16 h-16 rounded-full" />
					</HStack>

					<HStack space="md" className="h-24">
						<Skeleton className="flex-1" />
						<Skeleton className="flex-1" />
					</HStack>

					<HStack space="md" className="h-32">
						<Skeleton className="flex-1" />
						<Skeleton className="flex-1" />
						<Skeleton className="flex-1" />
					</HStack>

					<VStack space="md">
						<Skeleton className="h-24" />
						<Skeleton className="h-24" />
						<Skeleton className="h-24" />
						<Skeleton className="h-24" />
						<Skeleton className="h-24" />
					</VStack>
				</>
			}
		/>
	);
}
