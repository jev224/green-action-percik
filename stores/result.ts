import type { LucideIcon } from "lucide-react-native";
import { create } from "zustand";

type StatData = {
	title: string;
};

export type ResultData = {
	title: string;
	subtitle?: string;
	icon?: LucideIcon;
	stats?: StatData;
};

type ResultState = {
	result: ResultData | null;
	setResult: (params: ResultData) => void;
};

export const useResultStore = create<ResultState>((set) => ({
	result: null,
	setResult: (params) => set({ result: params }),
}));
