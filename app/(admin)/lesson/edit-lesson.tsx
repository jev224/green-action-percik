import Sortable from "react-native-sortables";

import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";

import { BackButton } from "@/components/domain";
import {
  ActionTile,
  Button,
  ListSection,
  PhotoPicker,
  Screen,
  ScreenHeader,
  TextAreaField,
  TextField,
} from "@/components/primitives";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";

const DATA = Array.from({ length: 3 }, (_, index) => `Item ${index + 1}`);

export default function EditLessonScreen() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <Screen
      scrollable
      headerComponent={
        <ScreenHeader title="Edit Materi" leftComponent={<BackButton />} />
      }
      contentComponent={
        <>
          {/* Basic information */}
          <ListSection title="Judul" size="md">
            <TextField placeholder="Pengertian Sampah" />
          </ListSection>

          <ListSection title="Deskripsi" size="md">
            <TextAreaField placeholder="Deskripsi untuk materi ini..." />
          </ListSection>

          {/* Profile photo */}
          <ListSection title="Gambar sampul" size="md">
            <PhotoPicker />
          </ListSection>

          {/* Profile photo */}
          <ListSection title="Konten" size="md">
            <Sortable.Grid
              columns={1}
              data={DATA}
              renderItem={({ item }) => (
                <ActionTile
                  title={"OSS"}
                  description="dededede"
                  onPress={() => {
                    setShowDrawer(true);
                  }}
                />
              )}
              rowGap={10}
              columnGap={10}
            />
          </ListSection>

          {/* Save */}
          <Button label="Simpan" />
        </>
      }
      overlayComponent={
        <Drawer
          isOpen={showDrawer}
          size="lg"
          anchor="bottom"
          onClose={() => {
            setShowDrawer(false);
          }}
        >
          <DrawerBackdrop />

          <DrawerContent>
            <DrawerHeader>
              <ScreenHeader
                title="Edit Konten"
                rightComponent={
                  <DrawerCloseButton>
                    <Icon
                      as={CloseIcon}
                      className="stroke-foreground"
                      size="lg"
                    />
                  </DrawerCloseButton>
                }
              />
            </DrawerHeader>

            <DrawerBody>
              <VStack space="lg">
                <ListSection title="Judul" size="md">
                  <TextField placeholder="Pengertian Sampah" />
                </ListSection>

                <ListSection title="Deskripsi" size="md">
                  <TextAreaField placeholder="Deskripsi untuk materi ini..." />
                </ListSection>
              </VStack>
            </DrawerBody>

            <DrawerFooter className="mb-4">
              <Button
                label="Simpan"
                onPress={() => {
                  setShowDrawer(false);
                }}
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      }
    />
  );
}
