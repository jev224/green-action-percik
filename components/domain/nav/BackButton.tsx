import { Href } from "expo-router";
import { IconButton } from "@/components/primitives/Button/IconButton";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { useNavigation } from "@/hooks/useNavigation";

interface BackButtonProps {
  fallbackHref?: Href;
}

export function BackButton({ fallbackHref }: BackButtonProps) {
  const { goBack } = useNavigation();

  return (
    <IconButton icon={ChevronLeftIcon} onPress={() => goBack(fallbackHref)} />
  );
}
