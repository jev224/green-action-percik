import React, { useState } from "react";

import { useAnimatedStyle, withSpring } from "react-native-reanimated";

import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Select, SelectIcon, SelectItem } from "@/components/ui/select";

import { AnimatedSelectTrigger } from "@/components/animation/animatedComponent";
import { AnimationConfig } from "@/components/animation/presets";

import { ArrowDownWideNarrow } from "lucide-react-native";

import { usePressFeedback } from "@/hooks/usePressFeedback";
import { SmoothSelectPortal } from "./SmoothSelectPortal";

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
  const { isPressing, bind } = usePressFeedback(1);

  const currentValue = stateToValue(value);

  const triggerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isPressing ? 0.9 : 1, AnimationConfig.spring.bouncy),
      },
    ],
  }));

  const [isOpen, setIsOpen] = useState(false);

  const isActive = currentValue !== "none";

  return (
    <Select
      isFocused={isActive}
      selectedValue={currentValue}
      onValueChange={(v) => onChange(valueToState<TField>(v))}
      onClose={() => setIsOpen(false)}
    >
      <AnimatedSelectTrigger
        className="flex-1 self-start items-center justify-center aspect-square rounded-lg border-2"
        variant="rounded"
        size="lg"
        style={triggerAnimatedStyle}
        onPress={() => setIsOpen(true)}
        onPressIn={bind.onPressIn}
        onPressOut={bind.onPressOut}
      >
        <SelectIcon
          className={cn("w-6 h-6", isActive && "text-primary")}
          as={ArrowDownWideNarrow}
        />
      </AnimatedSelectTrigger>

      <SmoothSelectPortal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SelectItem className="py-4" label={noneLabel} value="none" />

        {options.map(({ field, label, ascLabel, descLabel }) => (
          <React.Fragment key={field}>
            <SelectItem
              className="py-4"
              label={ascLabel ?? `${label} (Naik)`}
              value={`${field}-asc`}
            />
            <SelectItem
              className="py-4"
              label={descLabel ?? `${label} (Turun)`}
              value={`${field}-desc`}
            />
          </React.Fragment>
        ))}
      </SmoothSelectPortal>
    </Select>
  );
}
