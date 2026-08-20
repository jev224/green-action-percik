import { ComponentProps } from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Button } from "./Button";
import type { ButtonIcon } from "@/components/ui/button";

type IconButtonProps = Omit<
  ComponentProps<typeof Button>,
  "label" | "icon" | "children" | "size"
> & {
  icon: ComponentProps<typeof ButtonIcon>["as"];
  size?: "md" | "sm";
};

export function IconButton({
  icon,
  className,
  variant = "outline",
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      icon={icon}
      iconClassName={cn(size === "sm" && "w-5 h-5")}
      {...props}
      className={cn(
        "p-2 aspect-square rounded-sm",
        size === "sm" && "p-1",
        className,
      )}
      {...props}
    />
  );
}
