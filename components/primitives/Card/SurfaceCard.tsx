// components/primitives/Card/SurfaceCard.tsx
//
// Shared base for any card that needs semantic color theming
// (solid/outline x primary/success/warning/...). StatCard and ActionTile
// both sit on top of this instead of each re-declaring the same 12-color
// x 2-variant matrix, which is what the old ActionCard/StatisticCard did
// independently (~280 lines each, two different prop shapes for the same
// idea).
//
// SurfaceCard itself has no opinion about layout — it just resolves
// { color, variant } into real classNames and hands them to you.

import { ReactNode } from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Card } from "@/components/ui/card";
import type { SemanticColor, SurfaceVariant } from "@/components/styles/tokens";
import { cardColorStyles } from "@/components/styles/cardColorStyles";

export interface SurfaceCardStyles {
  card: string;
  thumbnail: string;
  icon: string;
  text: string;
}

export function resolveSurfaceStyles(
  color: SemanticColor,
  variant: SurfaceVariant,
): SurfaceCardStyles {
  return cardColorStyles[color]?.[variant] ?? cardColorStyles.neutral.outline;
}

interface SurfaceCardProps {
  color?: SemanticColor;
  variant?: SurfaceVariant;
  className?: string;
  children: ReactNode | ((styles: SurfaceCardStyles) => ReactNode);
}

export function SurfaceCard({
  color = "neutral",
  variant = "outline",
  className,
  children,
}: SurfaceCardProps) {
  const styles = resolveSurfaceStyles(color, variant);

  return (
    <Card
      className={cn("shadow-none overflow-hidden p-4", styles.card, className)}
    >
      {typeof children === "function" ? children(styles) : children}
    </Card>
  );
}
