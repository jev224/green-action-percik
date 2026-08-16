// components/primitives/List/List.tsx
//
// Was lists/MenuList.tsx — 230 lines: MenuList.Item/.Icon/.Text/.Chevron,
// a style context, forwardRef on every sub-piece. Same pattern as the old
// SegmentedControl: a compound JSX API for something that's really just
// "here's a list of rows, each with an icon/label/optional trailing
// element." This version takes that as data instead.
//
// If a row needs something totally custom (not icon+label+trailing), pass
// a `render` function for that one item instead of fighting the shape —
// that's a deliberate escape hatch, not a sign this needs to become a
// compound component again.

import { ComponentProps, Fragment, ReactNode } from "react";
import { View, Pressable, Text } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { ChevronRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export interface ListItemData {
  key: string;
  label: string;
  icon?: ComponentProps<typeof Icon>["as"];
  /** "destructive" tints icon + label red (e.g. "Keluar" / Log out). */
  variant?: "default" | "destructive";
  onPress?: () => void;
  /** Custom trailing element (a Switch, a badge...). Defaults to a chevron if onPress is set. */
  trailing?: ReactNode;
  disabled?: boolean;
}

interface ListProps {
  items: ListItemData[];
  className?: string;
}

export function List({ items, className }: ListProps) {
  return (
    <View
      className={cn(
        "w-full bg-card rounded-xl border border-border overflow-hidden",
        className,
      )}
    >
      {items.map((item, index) => (
        <Fragment key={item.key}>
          <ListRow item={item} />
          {index < items.length - 1 && (
            <View className="h-px w-full bg-border" />
          )}
        </Fragment>
      ))}
    </View>
  );
}

function ListRow({ item }: { item: ListItemData }) {
  const isDestructive = item.variant === "destructive";
  const textColor = isDestructive ? "text-destructive" : "text-foreground";
  const iconColor = isDestructive ? "text-destructive" : "text-foreground/80";

  const content = (
    <View
      className={cn(
        "flex-row items-center gap-3 p-5",
        item.disabled && "opacity-40",
      )}
    >
      {item.icon && (
        <Icon as={item.icon} className={cn("h-5 w-5 shrink-0", iconColor)} />
      )}
      <Text className={cn("text-lg font-medium flex-1", textColor)}>
        {item.label}
      </Text>
      {item.trailing ??
        (item.onPress && (
          <Icon as={ChevronRight} className="h-4 w-4 text-foreground/40" />
        ))}
    </View>
  );

  if (!item.onPress) return content;

  return (
    <Pressable onPress={item.onPress} disabled={item.disabled}>
      {content}
    </Pressable>
  );
}
