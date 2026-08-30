import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Card } from "@/components/ui/card";

import {
  buildColorsCompoundVariants,
  buildColorVariantOptions,
  SemanticColor,
  SurfaceVariant,
} from "@/components/styles/buildColorsVariants";

const surfaceCardStyle = tv({
  slots: {
    card: "items-center shadow-none p-4",
    thumbnail: "items-center justify-center rounded-sm overflow-hidden",
    icon: "",
    text: "",
  },

  variants: {
    variant: {
      solid: {},
      outline: {},
    },

    color: buildColorVariantOptions(),
  },

  compoundVariants: [
    ...buildColorsCompoundVariants((color, { outline, solid }) => [
      {
        color,
        variant: "outline",
        class: {
          card: outline.surface,
          thumbnail: outline.surfaceInner,
          icon: outline.icon,
          text: outline.text,
        },
      },
      {
        color,
        variant: "solid",
        class: {
          card: solid.surface,
          thumbnail: solid.surfaceInner,
          icon: solid.icon,
          text: solid.text,
        },
      },
    ]),
  ],
});

export type SurfaceCardSlots = ReturnType<typeof surfaceCardStyle>;

type SurfaceCardProps = {
  color?: SemanticColor;
  variant?: SurfaceVariant;
  className?: string;
  children: ReactNode | ((styles: SurfaceCardSlots) => ReactNode);
} & Omit<ComponentProps<typeof Card>, "children">;

export function SurfaceCard({
  color = "neutral",
  variant = "outline",
  className,
  children,
  ...props
}: SurfaceCardProps) {
  const styles = surfaceCardStyle({ color, variant });

  return (
    <Card className={styles.card({ className })} {...props}>
      {typeof children === "function" ? children(styles) : children}
    </Card>
  );
}
