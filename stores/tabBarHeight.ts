import { create } from "zustand";

type TabBarHeightState = {
	height: number;
	setTabBarHeight: (height: number) => void;
};

export const useTabBarHeightStore = create<TabBarHeightState>((set) => ({
	height: 58,
	setTabBarHeight: (height) => set({ height }),
}));
