import { BackButton, ProfileHeader } from "@/components/domain";
import {
  Button,
  ListSection,
  Screen,
  ScreenHeader,
  StatCard,
  BottomPanel,
} from "@/components/primitives";

import { HStack } from "@/components/ui/hstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getStudentStatistics } from "@/services/student/statistics";
import { getStudentDetails } from "@/services/teacher/students";
import { useStudentActionStore } from "@/stores/studentOverview";
import { parseProfileInfo } from "@/utils";
import { Redirect } from "expo-router";
import { Apple, BrushCleaning, Bubbles, Medal } from "lucide-react-native";

export default function StudentOverviewScreen() {
  const studentData = useStudentActionStore((state) => state.studentData);

  if (!studentData) {
    return <Redirect href={"/(teacher)/(tabs)/students"} />;
  }

  const { data, isLoading, isError } = useAsyncData(
    async () => ({
      details: await getStudentDetails(studentData.userId),
      stats: await getStudentStatistics(studentData.userId),
    }),
    [],
  );

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
        details: { name, nis, class: classData },
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

          <ListSection title="Poin Siswa">
            <StatCard
              title="Poin"
              stats={studentPoints}
              color="warning"
              size="lg"
              icon={Medal}
              variant="outline"
            />
          </ListSection>
        </>
      )}
    />
  );
}
