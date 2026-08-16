// components/primitives/Input/SearchField.tsx
// Was inputs/SearchInput.tsx. Renamed to *Field to match TextField/
// SelectField/TextAreaField instead of standing out as the one "Input".

import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Input, InputField } from "@/components/ui/input";

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = "Cari...",
  className,
}: SearchFieldProps) {
  return (
    <Input
      className={cn("pl-5 py-3 border-2 rounded-lg shadow-none", className)}
    >
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </Input>
  );
}
