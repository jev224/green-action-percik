import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

import "expo-sqlite/localStorage/install";

// biome-ignore lint/style/noNonNullAssertion: Expo public environment variables are required at runtime
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
	// biome-ignore lint/style/noNonNullAssertion: Expo public environment variables are required at runtime
	process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient<Database>(
	supabaseUrl,
	supabasePublishableKey,
	{
		auth: {
			storage: localStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);
