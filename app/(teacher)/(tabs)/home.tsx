import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

import { Greeting } from "@/components/domain";

import {
  ActionTile,
  ListSection,
  Screen,
  StatCard,
} from "@/components/primitives";

import {
  Apple,
  BrushCleaning,
  Bubbles,
  Coins,
  GraduationCap,
  Recycle,
  Sprout,
  Trash2,
} from "lucide-react-native";

import { getAllStudentStats } from "@/services/teacher/students";
import { getTeacherProfile } from "@/services/teacher/profile";

import { useAsyncData } from "@/hooks/useAsyncData";

import { parseProfileInfo } from "@/utils";

export default function HomeScreen() {
  const { data, isLoading, isError, refresh, isRefreshing } = useAsyncData(
    async () => ({
      profile: await getTeacherProfile(),
      stats: await getAllStudentStats(),
    }),
    [],
  );

  return (
    <Screen
      scrollable
      isLoading={isLoading}
      isError={isError}
      data={data}
      onRefresh={refresh}
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

          <ListSection title="Aktivitas terbaru">
            <VStack space="md">
              <ActionTile
                title="Pengumpulan Sampah"
                description="Kumpulkan dan catat sampah organik atau anorganik"
                icon={Trash2}
                variant="solid"
                thumbnailPosition="right"
                onPress={() => {}}
              />

              <ActionTile
                title="Perawatan Taman"
                description="Catat kegiatan merawat tanaman dan taman sekolah"
                icon={Sprout}
                variant="solid"
                thumbnailPosition="right"
                onPress={() => {}}
              />

              <ActionTile
                title="Kegiatan Kompos"
                description="Catat partisipasi kegiatan kompos bulanan kelas"
                icon={Recycle}
                variant="solid"
                thumbnailPosition="right"
                onPress={() => {}}
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
