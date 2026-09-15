import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";

import Animated from "react-native-reanimated";

import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useThemeColors } from "@/hooks/useThemeColors";

type TextAreaFieldProps = ComponentProps<typeof TextareaInput> & {
	isDisabled?: boolean;
};

export function TextAreaField({
	onContentSizeChange,
	isDisabled,
	...props
}: TextAreaFieldProps) {
	const { colors } = useThemeColors();

	return (
		<Animated.View className="min-h-32 max-h-52 flex-none">
			<Textarea
				className="h-full rounded-md px-2 py-1 border-2 font-medium"
				isDisabled={isDisabled}
			>
				<TextareaInput
					{...props}
					className="text-lg min-h-32 max-h-64"
					multiline
					style={globalStyles.textInput}
					textAlignVertical="top"
					placeholderTextColor={colors.mutedForeground}
				/>
			</Textarea>
		</Animated.View>
	);
}

const globalStyles = StyleSheet.create({
	textInput: {
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
});
