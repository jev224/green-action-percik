import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { colors } from "@/constants/Colors";
import { useSettings } from "./useSettings";

export const useThemeColors = () => {
	const { settings } = useSettings();
	const [systemScheme, setSystemScheme] = useState<"dark" | "light">(
		Appearance.getColorScheme() === "dark" ? "dark" : "light",
	);

	useEffect(() => {
		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			setSystemScheme(colorScheme === "dark" ? "dark" : "light");
			console.log(colorScheme);
		});

		return () => subscription.remove();
	}, []);

	const scheme = settings.theme === "system" ? systemScheme : settings.theme;

	return { scheme, colors: colors[scheme] };
};
