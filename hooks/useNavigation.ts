import { User } from "@supabase/supabase-js";
import { Href, router, useNavigation as useExpoNavigation } from "expo-router";

export type NavigationAction = Readonly<{
  type: string;
  payload?: object;
  source?: string;
  target?: string;
}>;

export function useNavigation() {
  const navigation = useExpoNavigation();

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

  const setupRemoveListener = (fn: (action: NavigationAction) => void) => {
    return navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      fn(e.data.action);
    });
  };

  const resetTo = (href: Parameters<typeof router.replace>[0]) => {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace(href);
  };

  const navigateFromLogin = (user: User) => {
    const user_role = user.app_metadata.user_role;
    if (user_role === "teacher") {
      resetTo("/(teacher)/(tabs)/home");
    } else if (user_role === "student") {
      resetTo("/(student)/(tabs)/home");
    }
  };

  return {
    goBack,
    resetTo,
    navigateTo,
    navigateFromLogin,
    setupRemoveListener,
    dispatch: navigation.dispatch,
  };
}
