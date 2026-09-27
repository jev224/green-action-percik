import type { StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {},
};

export const createSSRSafeStorage = (): StateStorage => noopStorage;
