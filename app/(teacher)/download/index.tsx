import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Leaf,
  Trophy,
  Users,
} from "lucide-react-native";

import {
  Screen,
  ScreenHeader,
  SelectField,
  SurfaceCard,
  ActionTile,
  ListSection,
} from "@/components/primitives";

import { BackButton } from "@/components/domain";
import { Icon } from "@/components/ui/icon";

const CLASS_OPTIONS = [
  { label: "Semua Kelas", value: "all" },
  { label: "10-A", value: "10-A" },
  { label: "10-B", value: "10-B" },
  { label: "10-C", value: "10-C" },
];

const PERIOD_OPTIONS = [
  { label: "Agustus 2026", value: "2026-08" },
  { label: "Juli 2026", value: "2026-07" },
  { label: "Juni 2026", value: "2026-06" },
];

const REPORTS = [
  {
    title: "Laporan Bulanan",
    description: "Ringkasan aktivitas lingkungan",
    icon: FileText,
    color: "primary" as const,
  },
  {
    title: "Laporan Aktivitas",
    description: "Sampah, taman, dan kompos",
    icon: Leaf,
    color: "garden" as const,
  },
  {
    title: "Laporan Poin",
    description: "Poin dan penghargaan siswa",
    icon: Trophy,
    color: "warning" as const,
  },
];

const INCLUDED_DATA = [
  {
    title: "Data Siswa",
    description: "Nama, NIS, dan kelas siswa",
    icon: Users,
  },
  {
    title: "Data Aktivitas",
    description: "Sampah, perawatan taman, dan kompos",
    icon: BarChart3,
  },
  {
    title: "Poin & Penghargaan",
    description: "Poin dan status penghargaan",
    icon: Trophy,
  },
];

export default function DownloadScreen() {
  return (
    <Screen
      scrollable
      headerComponent={
        <ScreenHeader title="Ekspor Data" leftComponent={<BackButton />} />
      }
      contentComponent={
        <VStack space="xl">
          {/* Export Header */}
          <SurfaceCard color="primary">
            <HStack space="lg" className="items-center">
              <Box className="h-18 w-18 items-center justify-center rounded-sm bg-primary-foreground/50">
                <Icon as={FileSpreadsheet} className="text-primary" size="xl" />
              </Box>

              <VStack className="flex-1">
                <Heading size="md">Ekspor Data Sekolah</Heading>

                <Text size="sm">
                  Unduh data aktivitas lingkungan dalam format Excel
                </Text>
              </VStack>
            </HStack>
          </SurfaceCard>

          <ListSection title="Ekspor ke Excel">
            <SelectField value="all" options={CLASS_OPTIONS} />
            <SelectField value="2026-08" options={PERIOD_OPTIONS} />

            <SurfaceCard color="success" variant="solid">
              <VStack space="lg" className="p-2">
                <HStack space="lg" className="items-center">
                  <Box className="h-16 w-16 items-center justify-center rounded-2xl bg-success-foreground/20">
                    <FileSpreadsheet
                      size={24}
                      className="text-success-foreground"
                    />
                  </Box>

                  <VStack className="flex-1">
                    <Heading size="md" className="text-success-foreground">
                      Ekspor ke Excel
                    </Heading>

                    <Text className="text-sm text-success-foreground/80">
                      File akan disimpan dalam format .xlsx
                    </Text>
                  </VStack>
                </HStack>

                <Button variant="secondary" onPress={() => {}}>
                  <ButtonIcon as={Download} />
                  <ButtonText>Unduh File Excel</ButtonText>
                </Button>
              </VStack>
            </SurfaceCard>
          </ListSection>

          {/* Reports */}
          <ListSection title="Laporan">
            <VStack space="sm">
              {REPORTS.map((report) => (
                <ActionTile
                  key={report.title}
                  title={report.title}
                  description={report.description}
                  icon={report.icon}
                  color={report.color}
                  variant="outline"
                  trailing={<Icon className="mr-2" as={Download} />}
                  onPress={() => {}}
                />
              ))}
            </VStack>
          </ListSection>

          {/* Included Data */}
          <ListSection title="Data yang Disertakan">
            <SurfaceCard color="neutral" variant="outline">
              <VStack space="lg" className="p-5">
                {INCLUDED_DATA.map((item) => (
                  <HStack key={item.title} space="md" className="items-center">
                    <item.icon size={20} className="text-muted-foreground" />

                    <VStack className="flex-1">
                      <Text className="font-semibold text-foreground">
                        {item.title}
                      </Text>

                      <Text className="text-sm text-muted-foreground">
                        {item.description}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </SurfaceCard>
          </ListSection>
        </VStack>
      }
    />
  );
}
