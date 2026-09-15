// theme/useThemeColors.ts

import { colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSettings } from "./useSettings";

export const useThemeColors = () => {
  const { settings } = useSettings();
  const systemScheme = useColorScheme() === "dark" ? "dark" : "light";

  const scheme = settings.theme === "system" ? systemScheme : settings.theme;

  return { scheme, colors: colors[scheme] };
};
