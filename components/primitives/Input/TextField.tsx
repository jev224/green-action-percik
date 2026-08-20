import { ComponentProps, useState } from "react";
import { Keyboard, View } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  Input,
  InputField as GSInputField,
  InputIcon,
  InputSlot,
} from "@/components/ui/input";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { Check, Eye, EyeOff } from "lucide-react-native";
import { IconButton } from "../Button/IconButton";
import { Text } from "@/components/ui/text";

type TextFieldProps = Omit<
  ComponentProps<typeof GSInputField>,
  "onChangeText"
> & {
  className?: string;
  isDisabled?: boolean;
  isPassword?: boolean;
  isNumber?: boolean; // digits only
  isDecimal?: boolean; // digits + single decimal point (implies numeric keyboard)
  min?: number;
  max?: number;
  unit?: string; // e.g. "kg", "cm", "pcs" - shown inside the field
  onChangeText?: (text: string) => void;
};

function sanitizeNumeric(text: string, allowDecimal: boolean) {
  if (allowDecimal) {
    let sanitized = text.replace(/[^0-9.]/g, "");
    const firstDot = sanitized.indexOf(".");
    if (firstDot !== -1) {
      sanitized =
        sanitized.slice(0, firstDot + 1) +
        sanitized.slice(firstDot + 1).replace(/\./g, "");
    }
    return sanitized;
  }
  return text.replace(/[^0-9]/g, "");
}

function clamp(value: string, min?: number, max?: number) {
  if (value === "" || value === ".") return value;
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return value;
  if (min !== undefined && parsed < min) return String(min);
  if (max !== undefined && parsed > max) return String(max);
  return value;
}

export function TextField({
  className,
  isDisabled,
  isPassword,
  isNumber,
  isDecimal,
  min,
  max,
  unit,
  secureTextEntry,
  value,
  onChangeText,
  onBlur,
  onFocus,
  keyboardType,
  ...props
}: TextFieldProps) {
  const colors = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const { visible: keyboardVisible } = useKeyboardHeight();

  const isNumeric = isNumber || isDecimal;
  // Only show the confirm button when THIS field is focused
  // AND the keyboard is actually up (avoids flashing it for
  // other fields, and avoids it lingering during the close animation).
  const showConfirmButton = isNumeric && isFocused && keyboardVisible;

  const handleState = () => {
    setShowPassword((showState) => !showState);
  };

  const handleChangeText = (text: string) => {
    if (!isNumeric) {
      onChangeText?.(text);
      return;
    }
    const sanitized = sanitizeNumeric(text, !!isDecimal);
    setInternalValue(sanitized);
    onChangeText?.(sanitized);
  };

  const commitClamp = () => {
    const currentValue = value ?? internalValue;
    const clamped = clamp(String(currentValue), min, max);
    if (clamped !== currentValue) {
      setInternalValue(clamped);
      onChangeText?.(clamped);
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (isNumeric) commitClamp();
    onBlur?.(e);
  };

  const handleConfirm = () => {
    if (isNumeric) commitClamp();
    Keyboard.dismiss();
  };

  const inputFieldType = isPassword && !showPassword ? "password" : "text";

  const resolvedKeyboardType =
    keyboardType ??
    (isDecimal ? "decimal-pad" : isNumber ? "number-pad" : undefined);

  return (
    <View className="flex-row items-center gap-2">
      <Input
        className="flex-1 py-3 px-5 border-2 shadow-none"
        isDisabled={isDisabled}
      >
        <GSInputField
          type={inputFieldType}
          className={cn("text-lg ", className)}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={isPassword && !showPassword}
          value={value ?? (isNumeric ? internalValue : undefined)}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={resolvedKeyboardType}
          {...props}
        />

        {unit && (
          <InputSlot>
            <Text className="text-lg mr-1 font-medium">{unit}</Text>
          </InputSlot>
        )}

        {isPassword && (
          <InputSlot onPress={handleState}>
            <InputIcon as={showPassword ? Eye : EyeOff} />
          </InputSlot>
        )}
      </Input>

      {showConfirmButton && (
        <IconButton
          icon={Check}
          variant="default"
          className="aspect-auto p-4"
          onPress={handleConfirm}
        />
      )}
    </View>
  );
}
