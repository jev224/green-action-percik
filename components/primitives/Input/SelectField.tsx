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
  return (
    <Select selectedValue={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("rounded-md justify-between", className)}
        variant="outline"
        size="lg"
      >
        <SelectInput className="ml-3" placeholder={placeholder} />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="rounded-xl p-3">
          <SelectDragIndicatorWrapper className="mb-2">
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>

          {options.map((opt) => (
            <SelectItem key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
