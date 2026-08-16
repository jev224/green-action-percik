// components/primitives/Button/IconButton.tsx
//
// Icon-only button. Built on Button so it gets the same press animation +
// haptics for free. BackButton (in domain/nav) is just this + useNavigation.

import { ComponentProps } from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Button } from "./Button";
import type { ButtonIcon } from "@/components/ui/button";

type IconButtonProps = Omit<
  ComponentProps<typeof Button>,
  "label" | "icon" | "children" | "size"
> & {
  icon: ComponentProps<typeof ButtonIcon>["as"];
  size?: "sm" | "md" | "lg";
};

export function IconButton({
  icon,
  className,
  variant = "outline",
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      icon={icon}
      className={cn("p-2 rounded-sm", className)}
      {...props}
    />
  );
}
