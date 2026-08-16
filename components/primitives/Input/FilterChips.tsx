// components/primitives/Input/FilterChips.tsx
// Was inputs/FilterChips.tsx.
//
// BUG FIXED: the inactive chip's className had `bgmuted` (missing the
// dash) instead of `bg-muted`. Because it's not a real Tailwind class,
// NativeWind silently drops it — every inactive chip has been rendering
// with no background at all. Fixed below.

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

interface FilterChipsProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string | null) => void;
  allLabel?: string;
}

export function FilterChips({
  options,
  selected,
  onSelect,
  allLabel = "Semua",
}: FilterChipsProps) {
  if (options.length === 0) return null;

  return (
    <Box className="flex-row flex-wrap gap-2">
      <Chip
        label={allLabel}
        isActive={selected === null}
        onPress={() => onSelect(null)}
      />
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          isActive={selected === option}
          onPress={() => onSelect(option)}
        />
      ))}
    </Box>
  );
}

function Chip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "px-4 py-2 rounded-full border",
        isActive ? "bg-primary/90 border-primary" : "bg-muted border-border",
      )}
    >
      <Text
        className={
          isActive ? "text-primary-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
