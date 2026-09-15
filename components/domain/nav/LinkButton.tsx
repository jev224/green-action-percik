import type { Href } from "expo-router";
import type { ComponentProps } from "react";
import { Button } from "@/components/primitives/Button/Button";
import { useNavigation } from "@/hooks/useNavigation";

type LinkButtonProps = Omit<ComponentProps<typeof Button>, "onPress"> & {
	href: Href;
};

export function LinkButton({ href, ...props }: LinkButtonProps) {
	const { navigateTo } = useNavigation();

	return <Button onPress={() => navigateTo(href)} {...props} />;
}
