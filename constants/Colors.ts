/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// theme/colors.ts

const rawPalette = {
  light: {
    primary: "24 116 71",
    primaryForeground: "255 255 255",
    secondary: "226 241 231",
    secondaryForeground: "25 91 57",
    accent: "218 238 223",
    accentForeground: "24 116 71",
    success: "46 139 87",
    successForeground: "255 255 255",
    info: "65 122 181",
    infoForeground: "255 255 255",
    warning: "214 157 48",
    warningForeground: "255 255 255",
    destructive: "205 69 69",
    destructiveForeground: "255 255 255",
    organic: "74 145 82",
    organicForeground: "255 255 255",
    inorganic: "72 118 166",
    inorganicForeground: "255 255 255",
    compost: "139 119 58",
    compostForeground: "255 255 255",
    garden: "57 142 82",
    gardenForeground: "255 255 255",
    card: "255 255 252",
    background: "249 250 246",
    popover: "255 255 252",
    popoverForeground: "29 45 36",
    muted: "238 242 236",
    mutedForeground: "101 113 104",
    foreground: "29 45 36",
    border: "218 225 218",
    input: "218 225 218",
    ring: "38 125 77",
  },
  dark: {
    primary: "62 166 101",
    primaryForeground: "12 42 25",
    secondary: "31 66 45",
    secondaryForeground: "177 224 191",
    accent: "37 78 51",
    accentForeground: "128 205 153",
    success: "71 174 104",
    successForeground: "10 40 23",
    info: "91 145 201",
    infoForeground: "12 28 48",
    warning: "224 173 67",
    warningForeground: "52 37 10",
    destructive: "224 91 91",
    destructiveForeground: "54 15 15",
    organic: "93 172 99",
    organicForeground: "13 40 21",
    inorganic: "93 145 194",
    inorganicForeground: "14 31 47",
    compost: "177 153 76",
    compostForeground: "43 35 13",
    garden: "76 169 101",
    gardenForeground: "11 40 20",
    card: "21 31 24",
    background: "14 22 17",
    popover: "23 34 27",
    popoverForeground: "232 241 234",
    muted: "31 42 34",
    mutedForeground: "157 171 161",
    foreground: "235 242 236",
    border: "48 62 52",
    input: "48 62 52",
    ring: "72 177 105",
  },
} as const;

type ColorMode = keyof typeof rawPalette;
type ColorToken = keyof typeof rawPalette.light;

// derive rgb() strings for direct use in LinearGradient, BlurView, etc.
const deriveColors = (mode: ColorMode) =>
  Object.fromEntries(
    Object.entries(rawPalette[mode]).map(([key, value]) => [
      key,
      `rgb(${value})`,
    ]),
  ) as Record<ColorToken, string>;

export const colors = {
  light: deriveColors("light"),
  dark: deriveColors("dark"),
};
