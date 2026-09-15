import {
	Apple,
	BrushCleaning,
	Bubbles,
	Leaf,
	Medal,
	Sprout,
	Trash2,
} from "lucide-react-native";
import {
	GlowDecoration,
	GlowOrb,
	LeafDecoration,
} from "@/components/decoration";
import {
	ActionTile,
	ListSection,
	ProgressBar,
	Screen,
	ScreenHeader,
	StatCard,
} from "@/components/primitives";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
	getStudentStatistics,
	getStudentTargets,
} from "@/services/student/statistics";

import { calculatePercentage } from "@/utils";

export default function StatsiticScreen() {
	const { data, isLoading, isError, refresh, isRefreshing } =
		useAsyncData(async () => {
			const [stats, targets] = await Promise.all([
				getStudentStatistics(),
				getStudentTargets(),
			]);

			return { stats, targets };
		}, []);

	const { colors, scheme } = useThemeColors();
	const isDark = scheme === "dark";

	return (
		<Screen
			scrollable
			data={data}
			isLoading={isLoading}
			isError={isError}
			onRefresh={refresh}
			isRefreshing={isRefreshing}
			contentComponent={({
				stats: {
					wasteWeightTotal,
					gardenActivityCount,
					compostActivityCount,
					studentPoints,
				},
				targets: {
					wasteWeightTarget,
					compostActivityTarget,
					gardenActivityTarget,
				},
			}) => (
				<>
					<ScreenHeader title="Statistik kamu" />

					<StatCard
						stats={studentPoints}
						title={"Poin"}
						size="lg"
						color="warning"
						icon={Medal}
						outerDecoration={
							!isDark && (
								<GlowOrb color={colors.warning} minScale={1.5} maxScale={2} />
							)
						}
						innerDecoration={
							<GlowDecoration
								variant="edges"
								edgeColors={[colors.destructive, colors.warningForeground]}
							/>
						}
					/>

					<HStack space="md">
						<StatCard
							title="Sampah"
							stats={`${wasteWeightTotal} kg`}
							icon={Bubbles}
							variant="outline"
							fill
							animation="fun"
							color="organic"
							innerDecoration={
								<LeafDecoration
									variant="cluster"
									pattern="1"
									color={colors.organic}
								/>
							}
						/>

						<StatCard
							title="Perawatan"
							stats={`${gardenActivityCount} Kali`}
							icon={BrushCleaning}
							variant="outline"
							fill
							animation="fun"
							innerDecoration={
								<LeafDecoration
									variant="cluster"
									pattern="2"
									color={colors.primary}
								/>
							}
						/>

						<StatCard
							title="Kompos"
							stats={`${compostActivityCount} Kali`}
							icon={Apple}
							variant="outline"
							fill
							animation="fun"
							color="inorganic"
							innerDecoration={
								<LeafDecoration
									variant="cluster"
									pattern="3"
									color={colors.inorganic}
								/>
							}
						/>
					</HStack>

					<ListSection title="Target bulan ini">
						<ActionTile
							title="Sampah"
							icon={Trash2}
							variant="ghost"
							headerRightComponent={
								<Heading size="md">{wasteWeightTarget} kg</Heading>
							}
							bottomComponent={
								<ProgressBar
									text={`${wasteWeightTotal} dari ${wasteWeightTarget} kg terkumpul`}
									value={calculatePercentage(
										wasteWeightTotal,
										wasteWeightTarget,
									)}
								/>
							}
						/>

						<ActionTile
							title="Perawatan Taman"
							icon={Sprout}
							variant="ghost"
							headerRightComponent={
								<Heading size="md">{gardenActivityTarget}x</Heading>
							}
							bottomComponent={
								<ProgressBar
									text={`${gardenActivityCount} dari ${gardenActivityTarget} kegiatan`}
									value={calculatePercentage(
										gardenActivityCount,
										gardenActivityTarget,
									)}
								/>
							}
						/>

						<ActionTile
							title="Kompos"
							icon={Leaf}
							variant="ghost"
							headerRightComponent={
								<Heading size="md">{compostActivityTarget}x</Heading>
							}
							bottomComponent={
								<ProgressBar
									text={`${compostActivityCount} dari ${compostActivityTarget} kegiatan`}
									value={calculatePercentage(
										compostActivityCount,
										compostActivityTarget,
									)}
								/>
							}
						/>
					</ListSection>
				</>
			)}
			loadingComponent={
				<>
					<Skeleton className="h-42" />

					<HStack space="md" className="h-32">
						<Skeleton className="flex-1" />
						<Skeleton className="flex-1" />
						<Skeleton className="flex-1" />
					</HStack>

					<VStack space="md">
						<Skeleton className="h-24" />
						<Skeleton className="h-24" />
						<Skeleton className="h-24" />
					</VStack>
				</>
			}
		/>
	);
}
