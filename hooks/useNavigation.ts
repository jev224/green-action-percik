import { usePreventRemove } from "@react-navigation/native";
import {
	type Href,
	router,
	useNavigation as useExpoNavigation,
} from "expo-router";
import { useRef } from "react";
import { type UserRole, useUserStore } from "@/stores/user";

export function useNavigation() {
	const { profile } = useUserStore.getState();
	const navigation = useExpoNavigation();
	const skipGuardRef = useRef(false);

	const goBack = (fallbackHref?: Href) => {
		if (router.canGoBack()) {
			router.back();
		} else if (fallbackHref) {
			router.navigate(fallbackHref);
		}
	};

	const navigateTo = (href: Href) => {
		router.push(href);
	};

	const resetTo = (href: Parameters<typeof router.replace>[0]) => {
		if (router.canDismiss()) {
			router.dismissAll();
		}
		router.replace(href);
	};

	const navigateToHome = (role?: UserRole | null) => {
		const userRole = role ?? profile?.role;

		if (!userRole) {
			resetTo("/(auth)/login");
		} else if (userRole === "teacher") {
			resetTo("/(teacher)/(tabs)/home");
		} else if (userRole === "student") {
			resetTo("/(student)/(tabs)/home");
		}
	};

	// Guards screen removal (back gesture, hardware back, header back
	// button — they all funnel through this one listener). When blocked,
	// calls onBlocked with a `proceed` fn that resumes the exact action
	// that was intercepted.
	const useBackGuard = (
		shouldPrevent: boolean,
		onBlocked: (proceed: () => void) => void,
	) => {
		usePreventRemove(shouldPrevent, ({ data }) => {
			if (skipGuardRef.current) {
				skipGuardRef.current = false;
				navigation.dispatch(data.action);
				return;
			}
			onBlocked(() => navigation.dispatch(data.action));
		});
	};

	// Run a navigation action while skipping the guard for it — for
	// programmatic navigation you trigger yourself (e.g. after a
	// successful submit) where you already know it's safe to leave,
	// even though shouldPrevent may still be true this render.
	const bypassGuard = (fn: () => void) => {
		skipGuardRef.current = true;
		fn();
	};

	return {
		goBack,
		navigateTo,
		resetTo,
		navigateToHome,
		useBackGuard,
		bypassGuard,
	};
}
