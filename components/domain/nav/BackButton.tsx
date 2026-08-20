import { Href } from "expo-router";
import { IconButton } from "@/components/primitives/Button/IconButton";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { useNavigation } from "@/hooks/useNavigation";

interface BackButtonProps {
  fallbackHref?: Href;
  onPress?: () => void;
}

export function BackButton({ fallbackHref, onPress }: BackButtonProps) {
  const { goBack } = useNavigation();

  return (
    <IconButton
      icon={ChevronLeftIcon}
      onPress={onPress ? onPress : () => goBack(fallbackHref)}
    />
  );
}
