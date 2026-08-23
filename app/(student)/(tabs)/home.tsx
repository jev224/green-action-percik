import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
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
  Apple,
  BrushCleaning,
  Bubbles,
  Recycle,
  Sprout,
  Trash2,
} from "lucide-react-native";

import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";

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

          <QuoteCard />

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

          <ListSection title="Aksi Cepat">
            <VStack space="md">
              <ActionTile
                title="Pengumpulan Sampah"
                description="Kumpulkan dan catat sampah organik atau anorganik"
                icon={Trash2}
                variant="solid"
                onPress={() => navigateTo("/(student)/submit/waste-bank")}
              />

              <ActionTile
                title="Perawatan Taman"
                description="Catat kegiatan merawat tanaman dan taman sekolah"
                icon={Sprout}
                variant="solid"
                onPress={() => navigateTo("/(student)/submit/garden-activity")}
              />

              <ActionTile
                title="Kegiatan Kompos"
                description="Catat partisipasi kegiatan kompos bulanan kelas"
                icon={Recycle}
                variant="solid"
                onPress={() => navigateTo("/(student)/submit/compost-activity")}
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
