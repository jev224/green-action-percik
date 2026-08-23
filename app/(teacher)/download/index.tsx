import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

import { BackButton } from "@/components/domain";

import {
  Screen,
  ScreenHeader,
  SurfaceCard,
  ActionTile,
  ListSection,
  Button,
} from "@/components/primitives";

import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Trophy,
  Users,
} from "lucide-react-native";

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
        <>
          {/* Export Header */}
          <ActionTile
            title="Ekspor Data Sekolah"
            description="Unduh data aktivitas lingkungan dalam format Excel"
            icon={FileSpreadsheet}
            color="primary"
          />

          <ListSection title="Ekspor ke Excel">
            {/* <SelectField value="all" options={CLASS_OPTIONS} />
            <SelectField value="2026-08" options={PERIOD_OPTIONS} /> */}

            <ActionTile
              className="rounded-4xl p-3"
              thumbnailPosition="top"
              title="Ekspor Data Sekolah"
              description="Unduh data aktivitas lingkungan dalam format Excel"
              icon={FileSpreadsheet}
              color="primary"
              variant="solid"
              bottomComponent={
                <Button
                  className="mt-2 mb-1"
                  label="Unduh File Excel"
                  icon={Download}
                  variant="secondary"
                />
              }
            />
          </ListSection>

          {/* Included Data */}
          <ListSection title="Data yang Disertakan">
            <SurfaceCard color="neutral" variant="outline" className="p-5">
              {(styles) => (
                <VStack space="xl" className="">
                  {INCLUDED_DATA.map((item, index) => (
                    <HStack
                      key={index}
                      space="lg"
                      className="w-full items-start"
                    >
                      <Icon
                        className={styles.icon({
                          className: "w-5.5 h-5.5 mt-1",
                        })}
                        as={item.icon}
                      />

                      <VStack className="flex-1">
                        <Text className="font-semibold text-foreground leading-5">
                          {item.title}
                        </Text>

                        <Text className="text-sm text-muted-foreground leading-5 mt-0.5">
                          {item.description}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </SurfaceCard>
          </ListSection>
        </>
      }
    />
  );
}
