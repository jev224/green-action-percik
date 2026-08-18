import { View, Pressable, Text as RNText } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Icon } from "@/components/ui/icon";
import type { ComponentProps } from "react";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: ComponentProps<typeof Icon>["as"];
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View className={cn("flex-row w-full gap-3", className)}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              "flex-1 items-center justify-center rounded-md py-4 px-4 border border-border",
              active ? "bg-primary" : "bg-muted",
            )}
          >
            {option.icon && (
              <Icon
                as={option.icon}
                className={cn(
                  "mb-2",
                  active ? "text-primary-foreground" : "text-foreground",
                )}
              />
            )}
            <RNText
              className={cn(
                "font-bold text-base",
                active ? "text-primary-foreground" : "text-foreground",
              )}
            >
              {option.label}
            </RNText>
          </Pressable>
        );
      })}
    </View>
  );
}
