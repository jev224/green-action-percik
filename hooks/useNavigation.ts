import { Href, router } from "expo-router";
import { useRef } from "react";

export function useNavigation() {
  const isNavigatingRef = useRef(false);

  const goBack = (fallbackHref?: Href) => {
    if (isNavigatingRef.current) return;

    if (router.canGoBack()) {
      router.back();
      isNavigatingRef.current = true;
    } else if (fallbackHref) {
      router.navigate(fallbackHref);
      isNavigatingRef.current = true;
    }
  };

  const navigateTo = (href: Href) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    router.push(href);
  };

  return { goBack, navigateTo };
}
