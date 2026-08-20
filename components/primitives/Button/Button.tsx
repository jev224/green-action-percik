import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { EaseView } from "react-native-ease";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import {
  Button as GSButton,
  ButtonText,
  ButtonIcon,
  ButtonSpinner,
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
  iconClassName?: string;
  /** Shorthand — skip writing <ButtonText> yourself. */
  label?: string;
  /** Shorthand — skip writing <ButtonIcon> yourself. */
  icon?: ComponentProps<typeof ButtonIcon>["as"];
  /** Use instead of label/icon when you need full control over contents. */
  children?: React.ReactNode;

  fill?: boolean;

  size?: ComponentProps<typeof ButtonIcon>["size"] | "cta";

  /** Shows a spinner in place of `icon` and disables the button. */
  isLoading?: boolean;
  /** Optional text shown instead of `label` while `isLoading` is true. */
  loadingText?: string;
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
  isLoading,
  loadingText,
  isDisabled,
  disabled,
  iconClassName,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const { isPressing, bind, scaleAnimation } = usePressFeedback(
    size === "icon" ? 1.1 : 1.05,
  );

  const displayText = isLoading ? (loadingText ?? label) : label;

  return (
    <EaseView
      animate={scaleAnimation}
      transition={{ transform: PRESS_SCALE_TRANSITION }}
      style={{ flex: fill ? 1 : undefined }}
    >
      <GSButton
        className={cn(
          "overflow-hidden py-2.5 px-8",
          size !== "icon" && "min-w-24",
          size === "cta" && "py-4",
          className,
        )}
        size={size === "cta" ? "sm" : size}
        isDisabled={isDisabled}
        disabled={isLoading || isDisabled}
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
            {isLoading ? (
              <ButtonSpinner
                size="small"
                color={colors.primaryForeground}
                className={cn(size !== "icon" && "mr-2")}
              />
            ) : (
              icon && (
                <ButtonIcon
                  className={cn(
                    "w-6 h-6",
                    size !== "icon" && "mr-2",
                    iconClassName,
                  )}
                  as={icon}
                />
              )
            )}
            {displayText && (
              <ButtonText className="text-lg font-semibold">
                {displayText}
              </ButtonText>
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
