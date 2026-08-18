import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

import {
  Apple,
  Backpack,
  BrushCleaning,
  Bubbles,
  Coins,
  GraduationCap,
  Recycle,
  Sprout,
  Trash2,
} from "lucide-react-native";

import { Greeting } from "@/components/domain";
import {
  ActionTile,
  ListSection,
  Screen,
  StatCard,
} from "@/components/primitives";

export default function HomeScreen() {
  return (
    <Screen
      scrollable
      contentComponent={
        <>
          <Greeting name="Sharleen" info={`${"Guru RPL"} • Admin`} />

          <HStack space="md">
            <StatCard
              title="Siswa"
              stats="29"
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
              stats="120"
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
                stats="30 kg"
                icon={Bubbles}
                variant="outline"
                fill
                animation="fun"
                color="organic"
              />
              <StatCard
                title="Perawatan"
                stats="5 kali"
                icon={BrushCleaning}
                variant="outline"
                fill
                animation="fun"
              />
              <StatCard
                title="Kompos"
                stats="Ikut"
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
      }
    />
  );
}
