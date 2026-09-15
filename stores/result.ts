import type { LucideIcon } from "lucide-react-native";
import { create } from "zustand";

type ResultType = "success" | "failed";

type StatData = {
	title: string;
};

export type ResultData = {
	type: ResultType;
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
