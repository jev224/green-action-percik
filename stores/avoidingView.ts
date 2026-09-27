import { create } from "zustand";

type AvoidingViewState = {
	offset: number;
	setOffset: (offset: number) => void;
};

export const useAvoidingViewStore = create<AvoidingViewState>((set) => ({
	offset: 0,
	setOffset: (offset) => set({ offset }),
}));
