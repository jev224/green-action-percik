import { useColorScheme } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

import { Greeting } from "@/components/domain";

import {
  ActionTile,
  ListSection,
  QuoteCard,
  Screen,
  StatCard,
} from "@/components/primitives";

import {
  LeafDecoration,
  GlowDecoration,
  GlowOrb,
} from "@/components/decoration";

import {
  Apple,
  BrushCleaning,
  Bubbles,
  Recycle,
  Sprout,
  Trash2,
} from "lucide-react-native";

import { images } from "@/constants/Images";

import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useThemeColors } from "@/hooks/useThemeColors";

import { getStudentStatistics } from "@/services/student/statistics";
import { getStudentProfile } from "@/services/student/profile";

import { parseProfileInfo } from "@/utils";

export default function HomeScreen() {
  const { navigateTo } = useNavigation();

  const { data, isLoading, isError, refresh, isRefreshing } = useAsyncData(
    async () => ({
      profile: await getStudentProfile(),
      stats: await getStudentStatistics(),
    }),
    [],
  );

  const colors = useThemeColors();
  const isDark = useColorScheme() === "dark";

  return (
    <Screen
      scrollable
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRefresh={refresh}
      isRefreshing={isRefreshing}
      contentComponent={({
        stats: { wasteWeightTotal, gardenActivityCount, compostActivityCount },
        profile: { name, class: classData },
      }) => (
        <>
          <Greeting
            name={name}
            info={parseProfileInfo({ role: "student", ...classData })}
          />

          <QuoteCard
            outerDecoration={
              <>
                {!isDark && (
                  <GlowOrb color={colors.success} minScale={1.5} maxScale={2} />
                )}
                <LeafDecoration variant="accent" pattern="2" shadow="lg" />
              </>
            }
            innerDecoration={
              <Image
                source={images.bannerDecorationLight}
                className="size-full"
              />
            }
          />

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
