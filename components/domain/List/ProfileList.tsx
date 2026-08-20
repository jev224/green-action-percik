import { Button, List, ListItemData, Modal } from "@/components/primitives";

import { KeyRound, LogIn, Settings } from "lucide-react-native";
import { useState } from "react";
import { logout } from "@/services/auth";
import { useNavigation } from "@/hooks/useNavigation";

interface ProfileListProps {
  items?: ListItemData[];
}

export const ProfileList = ({ items }: ProfileListProps) => {
  const { resetTo, navigateTo } = useNavigation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    logout().finally(() => {
      setShowLogoutModal(false);
      resetTo("/(auth)/login");
    });
  };

  return (
    <>
      <List
        items={[
          ...(items ?? []),
          {
            key: "settings",
            label: "Pengaturan",
            icon: Settings,
            onPress: () => {},
          },

          {
            key: "change-password",
            label: "Ubah kata sandi",
            icon: KeyRound,
            onPress: () => navigateTo("/profile/change-password"),
          },
          {
            key: "logout",
            label: "Log Out",
            icon: LogIn,
            variant: "destructive",
            onPress: () => setShowLogoutModal(true),
          },
        ]}
      />

      <Modal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        title="Mau cabut dulu? 👋"
        description="Yakin mau logout? Santuy, progress kamu aman kok"
        contentComponent={
          <>
            <Button
              isDisabled={isLoggingOut}
              label="Batalkan"
              variant="outline"
              onPress={() => setShowLogoutModal(false)}
            />

            <Button
              isLoading={isLoggingOut}
              label="Keluar"
              variant="destructive"
              onPress={handleLogout}
            />
          </>
        }
      />
    </>
  );
};

export default ProfileList;
