import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";

import Animated from "react-native-reanimated";

// import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Input, InputField } from "@/components/ui/input";
import { useThemeColors } from "@/hooks/useThemeColors";

type TextAreaFieldProps = ComponentProps<typeof InputField> & {
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
			<Input
				className="h-full rounded-md p-2 border-2 font-medium web:outline-none"
				isDisabled={isDisabled}
			>
				<InputField
					{...props}
					className="text-lg min-h-32 max-h-64"
					multiline
					style={globalStyles.textInput}
					textAlignVertical="top"
					placeholderTextColor={colors.mutedForeground}
				/>
			</Input>
		</Animated.View>
	);
}

const globalStyles = StyleSheet.create({
	textInput: {
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
});
