/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// theme/colors.ts

const rawPalette = {
	light: {
		primary: "34 168 108",
		primaryForeground: "250 250 245",
		card: "249 254 245",
		secondary: "222 231 214",
		secondaryForeground: "22 34 26",
		background: "238 242 238",
		popover: "249 254 245",
		popoverForeground: "22 34 26",
		muted: "220 229 222",
		mutedForeground: "90 110 95",
		destructive: "231 0 11",
		destructiveForeground: "250 250 250",
		foreground: "22 34 26",
		border: "204 212 198",
		input: "206 218 198",
		ring: "64 150 102",
		accent: "180 210 179",
		accentForeground: "30 48 36",
		success: "34 168 108",
		successForeground: "255 255 255",
		info: "42 130 214",
		infoForeground: "250 250 250",
		warning: "235 158 24",
		warningForeground: "255 255 255",
		organic: "141 168 45",
		organicForeground: "255 255 255",
		inorganic: "56 130 214",
		inorganicForeground: "255 255 255",
		compost: "173 110 40",
		compostForeground: "255 255 255",
		garden: "96 168 62",
		gardenForeground: "255 255 255",
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
		card: "27 33 28",
		background: "17 21 18",
		popover: "29 35 30",
		popoverForeground: "232 241 234",
		muted: "40 47 41",
		mutedForeground: "157 171 161",
		foreground: "235 242 236",
		border: "60 68 60",
		input: "60 68 60",
		ring: "72 177 105",
	},
} as const;

type ColorMode = keyof typeof rawPalette;
export type ColorToken = keyof typeof rawPalette.light;
export type ThemeColors = Record<ColorToken, string>;

// derive rgb() strings for direct use in LinearGradient, BlurView, etc.
const deriveColors = (mode: ColorMode) =>
	Object.fromEntries(
		Object.entries(rawPalette[mode]).map(([key, value]) => [
			key,
			`rgb(${value})`,
		]),
	) as ThemeColors;

export const colors = {
	light: deriveColors("light"),
	dark: deriveColors("dark"),
};
