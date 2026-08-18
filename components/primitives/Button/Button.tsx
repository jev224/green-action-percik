import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { EaseView } from "react-native-ease";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import {
  Button as GSButton,
  ButtonText,
  ButtonIcon,
} from "@/components/ui/button";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  usePressFeedback,
  PRESS_SCALE_TRANSITION,
  PRESS_OPACITY_TRANSITION,
} from "@/hooks/usePressFeedback";

type ButtonProps = Omit<
  ComponentProps<typeof GSButton>,
  "children" | "size"
> & {
  /** Shorthand — skip writing <ButtonText> yourself. */
  label?: string;
  /** Shorthand — skip writing <ButtonIcon> yourself. */
  icon?: ComponentProps<typeof ButtonIcon>["as"];
  /** Use instead of label/icon when you need full control over contents. */
  children?: React.ReactNode;

  fill?: boolean;

  size?: ComponentProps<typeof ButtonIcon>["size"] | "cta";
};

export function Button({
  className,
  onPressIn,
  onPressOut,
  size,
  label,
  icon,
  children,
  fill,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const { isPressing, bind, scaleAnimation } = usePressFeedback(
    size === "icon" ? 1.1 : 1.05,
  );

  return (
    <EaseView
      animate={scaleAnimation}
      transition={{ transform: PRESS_SCALE_TRANSITION }}
      style={{ flex: fill ? 1 : undefined }}
    >
      <GSButton
        className={cn("overflow-hidden", size === "cta" && "py-3", className)}
        size={size === "cta" ? "sm" : size}
        onPressIn={(event) => {
          bind.onPressIn();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          bind.onPressOut();
          onPressOut?.(event);
        }}
        {...props}
      >
        <EaseView
          style={{ ...styles.overlay, backgroundColor: colors.foreground }}
          animate={{ opacity: isPressing ? 0.15 : 0.0 }}
          transition={{ opacity: PRESS_OPACITY_TRANSITION }}
        />
        {children ?? (
          <>
            {icon && (
              <ButtonIcon
                className={cn("w-6 h-6", size !== "icon" && "mr-2")}
                as={icon}
              />
            )}
            {label && (
              <ButtonText className="text-lg font-semibold">{label}</ButtonText>
            )}
          </>
        )}
      </GSButton>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", inset: 0 },
});
