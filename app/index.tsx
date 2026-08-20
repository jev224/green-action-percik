import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getRole } from "@/services/auth";
import { View } from "react-native";

type Role = "student" | "teacher" | null;

export default function Index() {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const role = await getRole();
        setRole(role);
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, []);

  if (loading) return <View className="bg-background" />;

  if (!role) {
    return <Redirect href="/(auth)/login" />;
  }

  if (role === "teacher") {
    return <Redirect href="/(teacher)/(tabs)/home" />;
  }

  return <Redirect href="/(student)/(tabs)/home" />;
}
