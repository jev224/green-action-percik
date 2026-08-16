// components/primitives/Input/SortSelect.tsx
// Was inputs/SortSelect.tsx. This one was already in good shape — generic,
// single responsibility, no store/nav coupling. Moved as-is, switched to a
// named export to match every other primitive.

import React from "react";

import {
  Select,
  SelectIcon,
  SelectPortal,
  SelectTrigger,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { ArrowDownWideNarrow } from "lucide-react-native";

export type SortDirection = "asc" | "desc";

export interface SortState<TField extends string = string> {
  field: TField;
  direction: SortDirection;
}

export interface SortFieldOption<TField extends string> {
  field: TField;
  label: string;
  ascLabel?: string;
  descLabel?: string;
}

interface SortSelectProps<TField extends string> {
  options: SortFieldOption<TField>[];
  value: SortState<TField> | null;
  onChange: (value: SortState<TField> | null) => void;
  noneLabel?: string;
}

const stateToValue = <TField extends string>(
  state: SortState<TField> | null,
) => (state ? `${state.field}-${state.direction}` : "none");

const valueToState = <TField extends string>(
  value: string,
): SortState<TField> | null => {
  if (value === "none") return null;
  const separatorIndex = value.lastIndexOf("-");
  const field = value.slice(0, separatorIndex) as TField;
  const direction = value.slice(separatorIndex + 1) as SortDirection;
  return { field, direction };
};

export function SortSelect<TField extends string>({
  options,
  value,
  onChange,
  noneLabel = "Tanpa urutan",
}: SortSelectProps<TField>) {
  const currentValue = stateToValue(value);

  return (
    <Select
      selectedValue={currentValue}
      onValueChange={(v) => onChange(valueToState<TField>(v))}
    >
      <SelectTrigger
        className="self-start items-center justify-center aspect-square rounded-full"
        variant="rounded"
        size="lg"
      >
        <SelectIcon
          className={cn("w-6 h-6", currentValue !== "none" && "text-primary")}
          as={ArrowDownWideNarrow}
        />
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="rounded-xl p-3">
          <SelectDragIndicatorWrapper className="mb-2">
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>

          {options.map(({ field, label, ascLabel, descLabel }) => (
            <React.Fragment key={field}>
              <SelectItem
                label={ascLabel ?? `${label} (Naik)`}
                value={`${field}-asc`}
              />
              <SelectItem
                label={descLabel ?? `${label} (Turun)`}
                value={`${field}-desc`}
              />
            </React.Fragment>
          ))}

          <SelectItem label={noneLabel} value="none" />
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
