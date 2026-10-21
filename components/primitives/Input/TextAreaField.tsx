import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";

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
		<Input
			className="min-h-64 native:max-h-64 rounded-md p-0 border-2 font-medium web:outline-none"
			isDisabled={isDisabled}
		>
			<InputField
				{...props}
				className="text-lg web:min-h-full"
				style={globalStyles.textInput}
				multiline
				textAlignVertical="top"
				placeholderTextColor={colors.mutedForeground}
			/>
		</Input>
	);
}

const globalStyles = StyleSheet.create({
	textInput: {
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
});
