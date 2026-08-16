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
