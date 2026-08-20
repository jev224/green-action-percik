import { FlatList } from "react-native";

import { HStack } from "@/components/ui/hstack";

import { LessonData, useLessons } from "@/hooks/useLessons";

import {
  Apple,
  BrushCleaning,
  Bubbles,
  Leaf,
  LeafyGreen,
  Medal,
  Plus,
  Sprout,
  Trash2,
} from "lucide-react-native";

import {
  ActionTile,
  List,
  ListSection,
  ProgressBar,
  Screen,
  ScreenHeader,
  StatCard,
} from "@/components/primitives";
import { Heading } from "@/components/ui/heading";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getHomeStatistics } from "@/services/student/statistics";
import { calculatePercentage } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";

const TARGETS = {
  waste: 160,
  compost: 1,
  garden: 4,
};

export default function StatsiticScreen() {
  const { data, isLoading, isError } = useAsyncData(getHomeStatistics, []);

  return (
    <Screen
      headerComponent={<ScreenHeader title="Statistik kamu" />}
      scrollable
      isLoading={isLoading}
      isError={isError}
      data={data}
      contentComponent={({
        wasteWeightTotal,
        gardenActivityCount,
        compostActivityCount,
        studentPoints,
      }) => (
        <>
          <StatCard
            stats={studentPoints}
            title={"Poin"}
            size="lg"
            color="warning"
            icon={Medal}
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

          <ListSection title="Target bulan ini">
            <ActionTile
              title="Sampah"
              icon={Trash2}
              variant="outline"
              headerRightComponent={
                <Heading size="md">{TARGETS.waste} kg</Heading>
              }
              bottomComponent={
                <ProgressBar
                  text={`${wasteWeightTotal} dari ${TARGETS.waste} kg terkumpul`}
                  value={calculatePercentage(wasteWeightTotal, TARGETS.waste)}
                />
              }
            />

            <ActionTile
              title="Perawatan Taman"
              icon={Sprout}
              variant="outline"
              headerRightComponent={
                <Heading size="md">{TARGETS.garden}x</Heading>
              }
              bottomComponent={
                <ProgressBar
                  text={`${gardenActivityCount} dari ${TARGETS.garden} kegiatan`}
                  value={calculatePercentage(
                    gardenActivityCount,
                    TARGETS.garden,
                  )}
                />
              }
            />

            <ActionTile
              title="Kompos"
              icon={Leaf}
              variant="outline"
              headerRightComponent={
                <Heading size="md">{TARGETS.compost}x</Heading>
              }
              bottomComponent={
                <ProgressBar
                  text={`${compostActivityCount} dari ${TARGETS.compost} kegiatan`}
                  value={calculatePercentage(
                    compostActivityCount,
                    TARGETS.compost,
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
