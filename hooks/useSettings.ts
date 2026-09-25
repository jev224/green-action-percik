import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { appInformation } from "@/constants/App";
import { assignKey } from "@/utils";

const isWeb = Platform.OS === "web";

export type Settings = {
	theme: "light" | "dark" | "system";
	rememberMe: boolean;
	rememberedUsername: string;
	rememberedPassword: string;
};

const SECURE_SETTINGS_KEYS = new Set<keyof Settings>([
	"rememberedPassword",
	"rememberedUsername",
]);

export const DEFAULT_SETTINGS = {
	theme: "system",
	rememberMe: true,
	rememberedUsername: "",
	rememberedPassword: "",
} as const satisfies Settings;

let cachedSettings: Settings = { ...DEFAULT_SETTINGS };
let isLoaded = false;
let listeners: Array<(s: Settings) => void> = [];

const secureStorage = {
	get(): string | null {
		return isWeb
			? localStorage.getItem(appInformation.storageKey)
			: SecureStore.getItem(appInformation.storageKey);
	},
	set(value: string) {
		if (isWeb) localStorage.setItem(appInformation.storageKey, value);
		else SecureStore.setItem(appInformation.storageKey, value);
	},
};

async function loadSettings(): Promise<Settings> {
	if (isLoaded) return cachedSettings;

	try {
		const settings = secureStorage.get();
		if (settings) Object.assign(cachedSettings, JSON.parse(settings));
	} catch {
		console.error("Settings: Failed to retrieve settings from AsyncStorage.");
	}

	try {
		const securedSettings = SecureStore.getItem(appInformation.storageKey);
		if (securedSettings)
			Object.assign(cachedSettings, JSON.parse(securedSettings));
	} catch {
		console.error("Settings: Failed to retrieve secure settings.");
	}

	isLoaded = true;

	return cachedSettings;
}

async function persist(next: Settings) {
	cachedSettings = next;

	for (const listener of listeners) {
		listener(next);
	}

	const regularSettings: Partial<Settings> = {};
	const securedSettings: Partial<Settings> = {};

	for (const k in next) {
		const key = k as keyof Settings;
		const value = next[key];

		if (SECURE_SETTINGS_KEYS.has(key)) {
			assignKey(securedSettings, key, value);
		} else {
			assignKey(regularSettings, key, value);
		}
	}

	await AsyncStorage.setItem(
		appInformation.storageKey,
		JSON.stringify(regularSettings),
	);

	secureStorage.set(JSON.stringify(securedSettings));
}

export function useSettings() {
	const [settings, setSettingsState] = useState<Settings>(cachedSettings);
	const [loaded, setLoaded] = useState(isLoaded);

	useEffect(() => {
		let mounted = true;

		loadSettings().then((settings) => {
			if (mounted) {
				setSettingsState(settings);
				setLoaded(true);
			}
		});

		const listener = (s: Settings) => setSettingsState(s);
		listeners.push(listener);

		return () => {
			mounted = false;
			listeners = listeners.filter((l) => l !== listener);
		};
	}, []);

	const get = useCallback(<K extends keyof Settings>(key: K): Settings[K] => {
		return cachedSettings[key];
	}, []);

	const set = useCallback(
		async <K extends keyof Settings>(key: K, value: Settings[K]) => {
			const next = { ...cachedSettings, [key]: value };
			await persist(next);
		},
		[],
	);

	const update = useCallback(async (partial: Partial<Settings>) => {
		const next = { ...cachedSettings, ...partial };
		await persist(next);
	}, []);

	const reset = useCallback(async () => {
		await persist(DEFAULT_SETTINGS);
	}, []);

	return { settings, isLoaded: loaded, get, set, update, reset };
}
