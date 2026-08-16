// components/primitives/Input/TextField.tsx
// Was inputs/InputField.tsx. Renamed so every field follows
// "<Purpose>Field" (TextField, SelectField, TextAreaField) instead of the
// old mix of Field/Input/Select naming.

import { ComponentProps } from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Input, InputField as GSInputField } from "@/components/ui/input";

type TextFieldProps = ComponentProps<typeof GSInputField> & {
  className?: string;
};

export function TextField({ className, ...props }: TextFieldProps) {
  return (
    <Input className="py-3 px-5" isDisabled={false}>
      <GSInputField className={cn("text-lg", className)} {...props} />
    </Input>
  );
}
