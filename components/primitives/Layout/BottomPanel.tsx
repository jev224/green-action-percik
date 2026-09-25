import type { ComponentProps } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tv, type VariantProps } from "tailwind-variants";

const bottomPanelStyle = tv({
	base: "p-8 rounded-t-xl",
	variants: {
		variant: {
			ghost: "bg-transparent border-0",
			solid: "bg-muted",
		},
	},
});

type StyleProps = VariantProps<typeof bottomPanelStyle>;

interface BottomPanelProps {
	variant?: StyleProps["variant"];
}

export const BottomPanel = ({
	variant = "solid",
	children,
	...props
}: BottomPanelProps & ComponentProps<typeof View>) => {
	const styles = bottomPanelStyle({ variant });

	return (
		<View className="absolute w-full bottom-0" {...props}>
			<View className={styles}>
				<SafeAreaView edges={["bottom"]}>{children}</SafeAreaView>
			</View>
		</View>
	);
};
