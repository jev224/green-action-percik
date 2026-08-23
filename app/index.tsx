import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { getRole } from "@/services/auth";
import { Button, Modal } from "@/components/primitives";
import { checkConnection } from "@/utils";

type Role = "student" | "teacher" | null;

const ROLE_ROUTES = {
  teacher: "/(teacher)/(tabs)/home",
  student: "/(student)/(tabs)/home",
} as const;

export default function Index() {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const [showNetworkDialog, setShowNetworkDialog] = useState(false);

  const loadRole = async () => {
    setLoading(true);

    const isOnline = await checkConnection();

    if (!isOnline) {
      setShowNetworkDialog(true);
      setLoading(false);
      return;
    }

    try {
      const fetchedRole = await getRole();
      setRole(fetchedRole);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setShowNetworkDialog(false);
    setTimeout(loadRole, 2000);
  };

  useEffect(() => {
    loadRole();
  }, []);

  if (loading || showNetworkDialog) {
    return (
      <>
        <View className="bg-background flex-1" />

        <Modal
          isOpen={showNetworkDialog}
          onClose={() => setShowNetworkDialog(false)}
          title="Tidak Ada Koneksi Internet"
          description="Periksa koneksi internet kamu lalu coba lagi"
          contentComponent={<Button label="Oke" onPress={handleRetry} />}
        />
      </>
    );
  }

  if (!role) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={ROLE_ROUTES[role]} />;
}
