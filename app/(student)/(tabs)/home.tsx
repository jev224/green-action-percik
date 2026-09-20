import {
	Apple,
	BrushCleaning,
	Bubbles,
	Recycle,
	Sprout,
	Trash2,
} from "lucide-react-native";
import {
	GlowDecoration,
	GlowOrb,
	LeafDecoration,
} from "@/components/decoration";
import { Greeting } from "@/components/domain";
import {
	ActionTile,
	HomeCarousel,
	ListSection,
	QuoteCard,
	Screen,
	StatCard,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";

import { images } from "@/constants/Assets";

import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserProfile } from "@/hooks/useUser";
import { fetchStudentStatistics } from "@/services/fetcher/shared/student";
import { parseProfileInfo } from "@/utils";

export default function HomeScreen() {
	const { navigateTo } = useNavigation();

	const userProfile = useUserProfile("student");

	const { data, isLoading, isError, errorMessage, refresh, isRefreshing } =
		useAsyncData(
			async (profile) =>
				profile && {
					profile,
					stats: await fetchStudentStatistics(profile.user_id),
				},
			userProfile,
		);

	const { colors, scheme } = useThemeColors();
	const isDark = scheme === "dark";

	return (
		<Screen
			scrollable
			data={data}
			isLoading={isLoading}
			isError={isError}
			isRefreshing={isRefreshing}
			errorMessage={errorMessage}
			onRefresh={refresh}
			onTryAgain={refresh}
			requiredInternet
			contentComponent={({
				stats: { wasteWeightTotal, gardenActivityCount, compostActivityCount },
				profile: { name, class: classData, photoUrl },
			}) => (
				<>
					<Greeting
						name={name}
						info={parseProfileInfo({ role: "student", ...classData })}
						imageSource={{ uri: photoUrl }}
					/>

					<HomeCarousel
						height={270}
						outerDecoration={
							!isDark && (
								<GlowOrb color={colors.success} minScale={1.5} maxScale={2} />
							)
						}
					>
						<QuoteCard
							outerDecoration={
								<LeafDecoration variant="accent" pattern="2" shadow="lg" />
							}
							innerDecoration={
								<Image
									source={images.bannerDecorationLight}
									className="size-full"
								/>
							}
						/>

						<QuoteCard
							outerDecoration={
								<LeafDecoration variant="accent" pattern="2" shadow="lg" />
							}
							innerDecoration={
								<Image
									source={images.bannerDecorationLight}
									className="size-full"
								/>
							}
						/>
					</HomeCarousel>

					<ListSection
						title="Statistik saat ini"
						decoration={<LeafDecoration pattern="3" variant="accent" />}
					>
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
									<>
										<GlowDecoration
											color={colors.organic}
											colorForeground={colors.organicForeground}
										/>

										<LeafDecoration
											variant="cluster"
											pattern="1"
											color={colors.organic}
										/>
									</>
								}
								outerDecoration={
									<LeafDecoration variant="accent" pattern="6" shadow="md" />
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
									<>
										<GlowDecoration
											color={colors.primary}
											colorForeground={colors.primaryForeground}
										/>
										<LeafDecoration
											variant="cluster"
											pattern="2"
											color={colors.primary}
										/>
									</>
								}
								outerDecoration={
									<LeafDecoration variant="accent" pattern="5" shadow="md" />
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
									<>
										<GlowDecoration
											color={colors.inorganic}
											colorForeground={colors.inorganicForeground}
										/>
										<LeafDecoration
											variant="cluster"
											pattern="3"
											color={colors.inorganic}
										/>
									</>
								}
								outerDecoration={
									<LeafDecoration variant="accent" pattern="4" shadow="md" />
								}
							/>
						</HStack>
					</ListSection>

					<ListSection
						title="Aksi Cepat"
						decoration={<LeafDecoration pattern="3" variant="accent" />}
					>
						<VStack space="md">
							<ActionTile
								title="Pengumpulan Sampah"
								description="Kumpulkan dan catat sampah organik atau anorganik"
								icon={Trash2}
								variant="solid"
								onPress={() => navigateTo("/(student)/submit/waste-bank")}
								innerDecoration={
									<GlowDecoration
										variant="edges"
										edgeColors={[colors.primary, colors.accent]}
									/>
								}
								outerDecoration={
									<LeafDecoration variant="accent" pattern="1" />
								}
							/>

							<ActionTile
								title="Perawatan Taman"
								description="Catat kegiatan merawat tanaman dan taman sekolah"
								icon={Sprout}
								variant="solid"
								onPress={() => navigateTo("/(student)/submit/garden-activity")}
								innerDecoration={
									<GlowDecoration
										variant="edges"
										edgeColors={[colors.primary, colors.accent]}
									/>
								}
								outerDecoration={
									<LeafDecoration variant="accent" pattern="1" />
								}
							/>

							<ActionTile
								title="Kegiatan Kompos"
								description="Catat partisipasi kegiatan kompos bulanan kelas"
								icon={Recycle}
								variant="solid"
								onPress={() => navigateTo("/(student)/submit/compost-activity")}
								innerDecoration={
									<GlowDecoration
										variant="edges"
										edgeColors={[colors.primary, colors.accent]}
									/>
								}
								outerDecoration={
									<LeafDecoration variant="accent" pattern="1" />
								}
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

					<Skeleton className="h-64" />

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
