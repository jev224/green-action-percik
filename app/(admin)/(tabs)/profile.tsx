import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";

import { ProfileHeader } from "@/components/domain";
import { Button, List, Screen } from "@/components/primitives";

import { Download, KeyRound, LogIn, Settings } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Screen
      contentComponent={
        <>
          <ProfileHeader
            name="Sharleen"
            role={{
              type: "teacher",
              subject: "PPLG",
            }}
          />

          <List
            items={[
              {
                key: "settings",
                label: "Pengaturan",
                icon: Settings,
                onPress: () => {},
              },
              {
                key: "download",
                label: "Download",
                icon: Download,
                onPress: () => {
                  router.navigate("/(admin)/download");
                },
              },
              {
                key: "change-password",
                label: "Ubah kata sandi",
                icon: KeyRound,
                onPress: () => {
                  router.navigate("/profile/change-password");
                },
              },
              {
                key: "logout",
                label: "Log Out",
                icon: LogIn,
                variant: "destructive",
                onPress: () => setShowModal(true),
              },
            ]}
          />

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            size="lg"
          >
            <ModalBackdrop />

            <ModalContent>
              <ModalHeader>
                <Heading size="lg">Mau cabut dulu? 👋</Heading>
                <ModalCloseButton>
                  <Icon as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>

              <ModalBody>
                <Text>
                  <Text>Yakin mau logout? Santuy, progress kamu aman kok</Text>
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button
                  label="Batalkan"
                  variant="outline"
                  onPress={() => {
                    setShowModal(false);
                  }}
                />

                <Button
                  label="keluar"
                  variant="destructive"
                  onPress={() => {}}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      }
    />
  );
}
