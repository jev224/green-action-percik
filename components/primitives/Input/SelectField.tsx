import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import SmoothSelectPortal from "./SmoothSelectPortal";
import { useState } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectField({
  options,
  value,
  onValueChange,
  placeholder = "Select option",
  className,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      selectedValue={value}
      onValueChange={onValueChange}
      onClose={() => setIsOpen(false)}
    >
      <SelectTrigger
        className={cn("rounded-md justify-between py-4", className)}
        variant="outline"
        size="lg"
        onPress={() => setIsOpen(true)}
      >
        <SelectInput className="ml-3 font-medium" placeholder={placeholder} />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>

      <SmoothSelectPortal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {options.map((opt) => (
          <SelectItem
            className="py-4"
            key={opt.value}
            label={opt.label}
            value={opt.value}
          />
        ))}
      </SmoothSelectPortal>
    </Select>
  );
}
