import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

// biome-ignore lint/style/noNonNullAssertion: Expo public environment variables are required at runtime
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
	// biome-ignore lint/style/noNonNullAssertion: Expo public environment variables are required at runtime
	process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const isServer = typeof window === "undefined";

const noopStorage = {
	getItem: async () => null,
	setItem: async () => {},
	removeItem: async () => {},
};

export const supabase = createClient<Database>(
	supabaseUrl,
	supabasePublishableKey,
	{
		auth: {
			storage: isServer ? noopStorage : AsyncStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);
