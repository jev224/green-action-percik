import { Platform } from "react-native";
import type { SvgProps } from "react-native-svg";
import { Leaf1, Leaf2, Leaf3, Leaf4, Leaf5, Leaf6 } from "@/constants/Assets";
import type { ColorToken } from "@/constants/Colors";

export type LeafPattern = "1" | "2" | "3" | "4" | "5" | "6";

type LeafAsset = React.FC<SvgProps>;

interface LeafPlacement {
	asset: LeafAsset;
	className: string;
	size: number;
	opacity: number;
	colorKey?: ColorToken;
}

export const CLUSTER_ARRANGEMENTS: Record<LeafPattern, LeafPlacement[]> = {
	"1": [
		{
			asset: Leaf2,
			className: "absolute -bottom-6 -right-2 rotate-64",
			size: 64,
			opacity: 0.1,
		},
		{
			asset: Leaf2,
			className: "absolute -bottom-6 -left-16 rotate-24",
			size: 128,
			opacity: 0.2,
		},
	],
	"2": [
		{
			asset: Leaf2,
			className: "absolute -bottom-4 -right-6 rotate-12",
			size: 72,
			opacity: 0.2,
		},
		{
			asset: Leaf4,
			className: "absolute -bottom-4 -left-14 rotate-48",
			size: 96,
			opacity: 0.25,
		},
	],
	"3": [
		{
			asset: Leaf6,
			className: "absolute -bottom-6 left-2 rotate-64",
			size: 48,
			opacity: 0.2,
		},
		{
			asset: Leaf4,
			className: "absolute bottom-4 -left-14 rotate-28",
			size: 96,
			opacity: 0.2,
		},
	],

	"4": [],

	"5": [],

	"6": [],
};

export const ACCENT_ARRANGEMENTS: Record<LeafPattern, LeafPlacement[]> = {
	"1": [
		{
			asset: Leaf2,
			className: "absolute -bottom-4 -right-4 rotate-64",
			size: 64,
			opacity: 0.6,
			colorKey: "garden",
		},
	],
	"2": [
		{
			asset: Leaf5,
			className: "absolute top-8 -left-6 -rotate-8 ",
			size: 52,
			opacity: 1,
			colorKey: "garden",
		},
	],

	"3": [
		{
			asset: Leaf6,
			className: "absolute left-0 top-1 rotate-32",
			size: 24,
			opacity: 1,
			colorKey: "garden",
		},
	],
	"4": [
		{
			asset: Leaf6,
			className: "absolute bottom-12 -right-5 -rotate-12",
			size: 42,
			opacity: 0.8,
			colorKey: "info",
		},
	],
	"5": [
		{
			asset: Leaf1,
			className: "absolute -top-3 -left-5 -rotate-12",
			size: 52,
			opacity: 0.7,
			colorKey: "garden",
		},
	],
	"6": [
		{
			asset: Leaf3,
			className: "absolute -bottom-2 -left-6 ",
			size: 64,
			opacity: 0.7,
			colorKey: "organic",
		},
	],
};

const NATIVE_SHADOW = {
	none: {},
	sm: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 2,
	},
	md: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 4,
	},
	lg: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
} as const;

const WEB_SHADOW = {
	none: {},
	sm: { filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.15))" },
	md: { filter: "drop-shadow(0px 4px 5px rgba(0,0,0,0.2))" },
	lg: { filter: "drop-shadow(0px 8px 6px rgba(0,0,0,0.3))" },
} as const;

export const SHADOW_CONFIG = (
	Platform.OS === "web" ? WEB_SHADOW : NATIVE_SHADOW
) as typeof NATIVE_SHADOW;
