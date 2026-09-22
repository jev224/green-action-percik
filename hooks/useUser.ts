import { useEffect, useRef, useState } from "react";
import type { UserRole } from "@/services/fetcher/account/profile";
import {
	getProfileByRole,
	getUserData,
} from "@/services/fetcher/account/profile";
import { useUserStore } from "@/stores/userStore";
import { useNavigation } from "./useNavigation";
import { useShowToast } from "./useShowToast";

export function useUserProfile<R extends UserRole>(role?: R) {
	const { userStore, roleStore, setUserStore, setRoleStore } =
		useUserStore<R>();
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const isCancelledRef = useRef(false);

	const { resetTo } = useNavigation();
	const showToast = useShowToast();

	const validate = async () => {
		setIsLoading(true);
		setIsError(false);

		try {
			// no role requested — nothing to validate/fetch, bail out
			if (!role) return;
			// Only hit the network if we're missing something we don't already
			// have cached. If both role and profile are already in the store,
			// `data` stays null and we skip the fetch entirely.
			const data = roleStore && userStore ? null : await getUserData();

			if (isCancelledRef.current) return;

			// no cached role AND no session data from the server → not logged in
			if (!data && !roleStore) {
				showToast({
					title: "Sesi kamu telah berakhir, silakan login kembali",
				});
				resetTo("/(auth)/login");
				return;
			}

			// prefer the cached role; fall back to whatever the server just gave us
			const currentRole = roleStore ?? data?.role;

			// logged in, but as the wrong role for this screen — treat as invalid session
			if (currentRole !== role) {
				showToast({
					title: "Sesi kamu telah berakhir, silakan login kembali",
				});
				resetTo("/(auth)/login");
				return;
			}

			// role confirmed valid — cache it if it wasn't already
			if (!roleStore && currentRole) {
				setRoleStore(currentRole);
			}

			// fetch + cache the profile only if we don't already have one
			if (!userStore) {
				if (!data) {
					// defensive fallback: shouldn't be reachable given the check above,
					// but keeps TS happy about `data.id` below and fails safe
					resetTo("/(auth)/login");
					return;
				}

				const user = await getProfileByRole(data.id, role);

				// re-check after the second await — component may have unmounted
				// or `role` may have changed while this request was in flight
				if (isCancelledRef.current) return;

				setUserStore(user);
			}
		} catch (e) {
			setIsError(true);

			// biome-ignore lint/suspicious/noExplicitAny: Ignore any to force null
			setUserStore(null as any);
			// biome-ignore lint/suspicious/noExplicitAny: Ignore any to force null
			setRoleStore(null as any);
			console.log(e);
		} finally {
			if (!isCancelledRef.current) setIsLoading(false);
		}
	};

	useEffect(() => {
		validate();

		return () => {
			isCancelledRef.current = true;
		};
	}, [role]);

	const setUserProfile = () => {};

	const updateUserProfile = () => {};

	return {
		isLoading,
		profile: userStore,
		isError,
		setUserProfile,
		updateUserProfile,
		revalidate: validate,
	};
}
