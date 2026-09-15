import { ComponentProps, Fragment, ReactNode } from "react";
import { View, Pressable, Text } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { ChevronRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { EaseView } from "react-native-ease";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AnimationConfig } from "@/components/animation/presets";
import { config } from "@/components/animation/config";

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

  const { colors } = useThemeColors();
  const { bind, scaleAnimation, isPressing } = usePressFeedback(1.04);

  const animatedStyle = useAnimatedStyle(() => {
    const paddingVertical = interpolate(isPressing ? 1 : 0, [0, 1], [20, 24]);

    return {
      paddingVertical: withSpring(
        paddingVertical,
        AnimationConfig.spring.snappy,
      ),

      transform: [
        {
          scale: withSpring(
            isPressing ? 0.97 : 1,
            AnimationConfig.spring.snappy,
          ),
        },
      ],
    };
  });

  const content = (
    <Animated.View
      className={cn(
        "flex-row items-center gap-3 p-5",
        item.disabled && "opacity-40",
      )}
      style={animatedStyle}
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
    </Animated.View>
  );

  if (!item.onPress) return content;

  return (
    <Pressable
      delayHoverIn={0}
      unstable_pressDelay={config.pressableDelay}
      onPress={item.onPress}
      onPressIn={bind.onPressIn}
      onPressOut={bind.onPressOut}
      disabled={item.disabled}
    >
      <EaseView
        animate={{
          opacity: isPressing ? 0.2 : 0,
        }}
        transition={{
          type: "timing",
          duration: 100,
        }}
        style={{
          backgroundColor: colors.foreground,
          position: "absolute",
          inset: 0,
        }}
      />

      <EaseView animate={scaleAnimation}>{content}</EaseView>
    </Pressable>
  );
}
