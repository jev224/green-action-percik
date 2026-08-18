import { useState } from "react";

import Sortable from "react-native-sortables";

import { VStack } from "@/components/ui/vstack";
import { ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";

import { BackButton } from "@/components/domain";
import {
  ActionTile,
  Button,
  IconButton,
  ListSection,
  PhotoPicker,
  Screen,
  ScreenHeader,
  TextAreaField,
  TextField,
  Drawer,
  SortableCard,
  BottomPanel,
  Spacer,
} from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus } from "lucide-react-native";
import { KeyboardAvoidingView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";

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
            <TextAreaField placeholder="Deskripxsi untuk materi ini..." />
          </ListSection>

          {/* Profile photo */}
          <ListSection title="Gambar sampul" size="md">
            <PhotoPicker />
          </ListSection>

          <ListSection title="Konten" size="md">
            <Sortable.Grid
              columns={1}
              dropAnimationDuration={200}
              activationAnimationDuration={140}
              data={DATA}
              renderItem={({ item, index }) => (
                <SortableCard
                  title={item}
                  onPress={() => setShowDrawer(true)}
                />
              )}
              rowGap={10}
              columnGap={10}
            />

            <Button label="Tambahan Konten" variant="outline" icon={Plus} />
          </ListSection>

          <Spacer height={38} />
        </>
      }
      overlayComponent={
        <>
          <BottomPanel variant="ghost">
            <HStack space="md">
              <Button label="Simpan" fill size="cta" />
            </HStack>
          </BottomPanel>

          <Drawer
            avoidKeyboard
            isOpen={showDrawer}
            size="lg"
            anchor="bottom"
            onClose={() => {
              setShowDrawer(false);
            }}
            headerComponenent={
              <ScreenHeader
                title="Edit Konten"
                rightComponent={
                  <IconButton
                    icon={CloseIcon}
                    onPress={() => setShowDrawer(false)}
                  />
                }
              />
            }
            contentComponent={
              <VStack space="lg">
                <ListSection title="Judul" size="md">
                  <TextField
                    placeholder="Pengertian Sampah"
                    isDisabled={!showDrawer}
                  />
                </ListSection>

                <ListSection title="Deskripsi" size="md">
                  <TextAreaField
                    placeholder="Deskripsi untuk materi ini..."
                    isDisabled={!showDrawer}
                  />
                </ListSection>
              </VStack>
            }
            footerComponent={
              <Button
                size="cta"
                label="Simpan"
                onPress={() => {
                  setShowDrawer(false);
                }}
              />
            }
          />
        </>
      }
    />
  );
}
