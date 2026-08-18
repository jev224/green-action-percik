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
import { Apple, BrushCleaning, Bubbles, Medal } from "lucide-react-native";

export default function StudentOverviewScreen() {
  return (
    <Screen
      headerComponent={
        <ScreenHeader title="Detail Siswa" leftComponent={<BackButton />} />
      }
      overlayComponent={
        <BottomPanel variant="ghost">
          <HStack space="md">
            <Button label="Edit" fill size="cta" />
          </HStack>
        </BottomPanel>
      }
      contentComponent={
        <>
          <ProfileHeader
            name="Saki"
            layout="row"
            size="md"
            role={{
              type: "student",
              grade: "Kelas 10",
              nis: "2939039",
            }}
          />

          <ListSection title="Statistik siswa">
            <HStack space="md">
              <StatCard
                title="Sampah"
                stats="30 kg"
                icon={Bubbles}
                variant="outline"
                fill
              />
              <StatCard
                title="Perawatan"
                stats="5 kali"
                icon={BrushCleaning}
                variant="outline"
                fill
              />
              <StatCard
                title="Kompos"
                stats="Ikut"
                icon={Apple}
                variant="outline"
                fill
              />
            </HStack>
          </ListSection>

          <ListSection title="Poin Siswa">
            <StatCard
              title="Poin"
              stats="120"
              color="warning"
              size="lg"
              icon={Medal}
              variant="outline"
            />
          </ListSection>
        </>
      }
    />
  );
}
