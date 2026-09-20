import { usePreventRemove } from "@react-navigation/native";
import {
	type Href,
	router,
	useNavigation as useExpoNavigation,
} from "expo-router";
import { useRef } from "react";
import { getUserState } from "@/stores/userStore";

export function useNavigation() {
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

	const getHomeRoute = (): Href => {
		const userRole = getUserState().roleStore;

		if (userRole === "teacher") return "/(teacher)/(tabs)/home";
		if (userRole === "student") return "/(student)/(tabs)/home";

		return "/(auth)/login";
	};

	const navigateToFeedback = (href: Href) => {
		if (router.canDismiss()) {
			router.dismissAll();
		}

		router.replace(getHomeRoute());
		router.push(href);
	};

	const navigateToHome = () => resetTo(getHomeRoute());

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
		navigateToFeedback,
		useBackGuard,
		bypassGuard,
	};
}
