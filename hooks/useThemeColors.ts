// theme/useThemeColors.ts

import { colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const useThemeColors = () => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return colors[scheme];
};
