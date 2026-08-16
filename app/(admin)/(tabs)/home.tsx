import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

import {
  Apple,
  Backpack,
  BrushCleaning,
  Bubbles,
  Recycle,
  Sprout,
  Trash2,
} from "lucide-react-native";

import { Greeting } from "@/components/domain";
import {
  ActionTile,
  ListSection,
  QuoteCard,
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
            <StatCard title="Siswa" stats="29" className="flex-1" size="md" />
            <StatCard title="Poin" stats="120" className="flex-1" size="md" />
          </HStack>

          <ListSection title="Statistik saat ixni">
            <HStack space="md">
              <StatCard
                title="Sampah"
                stats="30 kg"
                icon={Bubbles}
                variant="outline"
                className="flex-1"
              />
              <StatCard
                title="Perawatan"
                stats="5 kali"
                icon={BrushCleaning}
                variant="outline"
                className="flex-1"
              />
              <StatCard
                title="Kompos"
                stats="Ikut"
                icon={Apple}
                variant="outline"
                className="flex-1"
              />
            </HStack>
          </ListSection>

          <ListSection title="Aktivitas terbaru">
            <VStack space="md">
              <ActionTile
                title="Pengumpulan Sampah"
                description="Kumpulkan dan catat sampah organik atau anorganik"
                icon={Trash2}
                color="primary"
                variant="outline"
                onPress={() => {}}
              />

              <ActionTile
                title="Perawatan Taman"
                description="Catat kegiatan merawat tanaman dan taman sekolah"
                icon={Sprout}
                color="primary"
                variant="outline"
                onPress={() => {}}
              />

              <ActionTile
                title="Kegiatan Kompos"
                description="Catat partisipasi kegiatan kompos bulanan kelas"
                icon={Recycle}
                color="primary"
                variant="outline"
                onPress={() => {}}
              />
            </VStack>
          </ListSection>
        </>
      }
    />
  );
}
