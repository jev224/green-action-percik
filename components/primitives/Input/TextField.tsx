import { ComponentProps } from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Input, InputField as GSInputField } from "@/components/ui/input";
import { useThemeColors } from "@/hooks/useThemeColors";

type TextFieldProps = ComponentProps<typeof GSInputField> & {
  className?: string;
  isDisabled?: boolean;
};

export function TextField({ className, isDisabled, ...props }: TextFieldProps) {
  const colors = useThemeColors();

  return (
    <Input className="py-3 px-5 border-2 shadow-none" isDisabled={isDisabled}>
      <GSInputField
        className={cn("text-lg ", className)}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
    </Input>
  );
}
