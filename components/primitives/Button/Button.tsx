// components/primitives/Button/Button.tsx
//
// The ONE button for the whole app. Every button — navigation, submit,
// destructive, icon-only — starts here so press animation + haptics are
// never something you have to remember to add.
//
// Replaces: buttons/ActionButton.tsx, buttons/AnimatedButton.tsx,
// buttons/RedirectButton.tsx.
//
// What changed and why:
// - Old ActionButton took an `action: { type: "click" | "redirect" } `
//   union and called useNavigation() itself. That means every button had
//   to know about routing. Now Button only ever takes `onPress`; if a
//   screen wants to navigate, IT calls navigateTo() and passes the result
//   in as onPress. Navigation is a screen concern, not a button concern.
// - Old RedirectButton skipped AnimatedButton entirely, so redirect
//   buttons didn't feel the same as action buttons. Now there's only one
//   button, so that inconsistency can't happen again.

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

type ButtonProps = Omit<ComponentProps<typeof GSButton>, "children"> & {
  /** Shorthand — skip writing <ButtonText> yourself. */
  label?: string;
  /** Shorthand — skip writing <ButtonIcon> yourself. */
  icon?: ComponentProps<typeof ButtonIcon>["as"];
  /** Use instead of label/icon when you need full control over contents. */
  children?: React.ReactNode;

  fill?: boolean;
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
        className={cn("overflow-hidden", className)}
        size={size}
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
            {icon && <ButtonIcon className="mr-2 w-6 h-6" as={icon} />}
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
