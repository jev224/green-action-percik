// stores/userProfile.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "expo-zustand-persist";
import { create } from "zustand";
import type {
	ProfileByRole,
	UserRole,
} from "@/services/fetcher/account/profile";

type AnyProfile = ProfileByRole<UserRole>;

type InternalStore = {
	userStore: AnyProfile | null;
	roleStore: UserRole | null;
	setUserStore: (input: AnyProfile | null) => void;
	setRoleStore: (input: UserRole) => void;
};

const useInternalUserStore = create<InternalStore>()(
	persist(
		(set) => ({
			userStore: null,
			roleStore: null,
			setUserStore: (input) => set({ userStore: input }),
			setRoleStore: (role) => set({ roleStore: role }),
		}),
		{
			name: "use-user-store",
			version: 1,
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export function useUserStore<R extends UserRole>() {
	const userStore = useInternalUserStore((s) => s.userStore);
	const roleStore = useInternalUserStore((s) => s.roleStore);
	const setUserStore = useInternalUserStore((s) => s.setUserStore);
	const setRoleStore = useInternalUserStore((s) => s.setRoleStore);

	return {
		userStore: userStore as ProfileByRole<R> | null,
		roleStore: roleStore as R | null,
		setUserStore: (input: ProfileByRole<R>) => setUserStore(input),
		setRoleStore: (role: R) => setRoleStore(role),
	};
}

export function getUserState() {
	return useInternalUserStore.getState();
}
