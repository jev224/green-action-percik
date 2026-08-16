// components/domain/nav/LinkButton.tsx
// Replaces buttons/RedirectButton.tsx and the "redirect" half of the old
// ActionButton's action union. Lives in domain/ because it calls
// useNavigation() — the one place in the app allowed to know about routes
// by name. Everywhere else just takes onPress.

import { ComponentProps } from "react";
import { Href } from "expo-router";
import { Button } from "@/components/primitives/Button/Button";
import { useNavigation } from "@/hooks/useNavigation";

type LinkButtonProps = Omit<ComponentProps<typeof Button>, "onPress"> & {
  href: Href;
};

export function LinkButton({ href, ...props }: LinkButtonProps) {
  const { navigateTo } = useNavigation();

  return <Button onPress={() => navigateTo(href)} {...props} />;
}
