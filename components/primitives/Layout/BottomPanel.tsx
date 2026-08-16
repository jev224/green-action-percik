import { View, Text } from "react-native";
import React, { ComponentProps, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { SafeAreaView } from "react-native-safe-area-context";

const bottomPanelStyle = tv({
  base: "p-8 pb-2 rounded-t-xl",
  variants: {
    variant: {
      ghost: "bg-transparent border-0",
      solid: "bg-muted",
    },
  },
});

type StyleProps = VariantProps<typeof bottomPanelStyle>;

interface BottomPanelProps {
  variant?: StyleProps["variant"];
}

export const BottomPanel = ({
  variant = "solid",
  children,
  ...props
}: BottomPanelProps & ComponentProps<typeof View>) => {
  const styles = bottomPanelStyle({ variant });

  return (
    <View className="w-full h-full justify-end">
      <View className={styles}>
        <SafeAreaView edges={["bottom"]}>{children}</SafeAreaView>
      </View>
    </View>
  );
};
