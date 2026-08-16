// components/styles/buildColorsCompoundVariants.ts

export const COLORS = {
  primary: {
    solid: {
      surface: "bg-primary",
      icon: "text-primary-foreground",
      text: "text-primary-foreground",
    },
    outline: {
      surface: "bg-primary/10 dark:bg-primary/20 border-primary/50",
      icon: "text-primary",
      text: "text-primary",
    },
  },

  secondary: {
    solid: {
      surface: "bg-secondary",
      icon: "text-secondary-foreground",
      text: "text-secondary-foreground",
    },
    outline: {
      surface: "bg-secondary/10 dark:bg-secondary/20 border-secondary/50",
      icon: "text-secondary",
      text: "text-secondary",
    },
  },

  accent: {
    solid: {
      surface: "bg-accent",
      icon: "text-accent-foreground",
      text: "text-accent-foreground",
    },
    outline: {
      surface: "bg-accent/10 dark:bg-accent/20 border-accent/50",
      icon: "text-accent",
      text: "text-accent",
    },
  },

  neutral: {
    solid: {
      surface: "bg-neutral",
      icon: "text-neutral-foreground",
      text: "text-neutral-foreground",
    },
    outline: {
      surface: "bg-neutral/10 dark:bg-neutral/20 border-neutral/50",
      icon: "text-neutral",
      text: "text-neutral",
    },
  },

  success: {
    solid: {
      surface: "bg-success",
      icon: "text-success-foreground",
      text: "text-success-foreground",
    },
    outline: {
      surface: "bg-success/10 dark:bg-success/20 border-success/50",
      icon: "text-success",
      text: "text-success",
    },
  },

  info: {
    solid: {
      surface: "bg-info",
      icon: "text-info-foreground",
      text: "text-info-foreground",
    },
    outline: {
      surface: "bg-info/10 dark:bg-info/20 border-info/50",
      icon: "text-info",
      text: "text-info",
    },
  },

  warning: {
    solid: {
      surface: "bg-warning",
      icon: "text-warning-foreground",
      text: "text-warning-foreground",
    },
    outline: {
      surface: "bg-warning/10 dark:bg-warning/20 border-warning/50",
      icon: "text-warning",
      text: "text-warning",
    },
  },

  destructive: {
    solid: {
      surface: "bg-destructive",
      icon: "text-destructive-foreground",
      text: "text-destructive-foreground",
    },
    outline: {
      surface: "bg-destructive/10 dark:bg-destructive/20 border-destructive/50",
      icon: "text-destructive",
      text: "text-destructive",
    },
  },

  organic: {
    solid: {
      surface: "bg-organic",
      icon: "text-organic-foreground",
      text: "text-organic-foreground",
    },
    outline: {
      surface: "bg-organic/10 dark:bg-organic/20 border-organic/50",
      icon: "text-organic",
      text: "text-organic",
    },
  },

  inorganic: {
    solid: {
      surface: "bg-inorganic",
      icon: "text-inorganic-foreground",
      text: "text-inorganic-foreground",
    },
    outline: {
      surface: "bg-inorganic/10 dark:bg-inorganic/20 border-inorganic/50",
      icon: "text-inorganic",
      text: "text-inorganic",
    },
  },

  compost: {
    solid: {
      surface: "bg-compost",
      icon: "text-compost-foreground",
      text: "text-compost-foreground",
    },
    outline: {
      surface: "bg-compost/10 dark:bg-compost/20 border-compost/50",
      icon: "text-compost",
      text: "text-compost",
    },
  },

  garden: {
    solid: {
      surface: "bg-garden",
      icon: "text-garden-foreground",
      text: "text-garden-foreground",
    },
    outline: {
      surface: "bg-garden/10 dark:bg-garden/20 border-garden/50",
      icon: "text-garden",
      text: "text-garden",
    },
  },
} as const;

export type SemanticColor = keyof typeof COLORS;

export type SurfaceVariant = keyof (typeof COLORS)[SemanticColor];

export type ColorStyles = (typeof COLORS)[SemanticColor];

export interface CardCompoundVariant<TSlotKey extends string = string> {
  color: SemanticColor;
  variant: SurfaceVariant;
  class: Partial<Record<TSlotKey, string>>;
}

/**
 * Builds the color options used by TVA/CVA.
 *
 * Result:
 *
 * {
 *   primary: {},
 *   secondary: {},
 *   accent: {},
 *   ...
 * }
 */
export function buildColorVariantOptions(): Record<
  SemanticColor,
  Record<string, never>
> {
  return Object.fromEntries(
    Object.keys(COLORS).map((color) => [color, {}]),
  ) as Record<SemanticColor, Record<string, never>>;
}

/**
 * Builds compound variants for one specific color.
 */
export function buildColorCompoundVariants<TSlotKey extends string>(
  color: SemanticColor,
  build: (styles: ColorStyles) => CardCompoundVariant<TSlotKey>[],
): CardCompoundVariant<TSlotKey>[] {
  return build(COLORS[color]);
}

/**
 * Builds compound variants for every semantic color.
 */
export function buildColorsCompoundVariants<TSlotKey extends string>(
  build: (
    color: SemanticColor,
    styles: ColorStyles,
  ) => CardCompoundVariant<TSlotKey>[],
  overrides?: Partial<Record<SemanticColor, CardCompoundVariant<TSlotKey>[]>>,
): CardCompoundVariant<TSlotKey>[] {
  return (Object.keys(COLORS) as SemanticColor[]).flatMap((color) => {
    return (
      overrides?.[color] ??
      buildColorCompoundVariants(color, (styles) => build(color, styles))
    );
  });
}
