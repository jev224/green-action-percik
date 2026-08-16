// components/styles/cardColorStyles.ts
//
// IMPORTANT — why this isn't `bg-${color}`:
// NativeWind extracts className strings statically at build time. A template
// literal like `bg-${color}` is invisible to that extraction and will not
// produce working styles on device, even though it looks fine in the editor.
// Every className below MUST stay a literal string for that reason — this
// file trades "generate it programmatically" for "list it once, in one
// place" instead. That's the real fix for the copy-paste bloat in the old
// ActionCard/StatisticCard files: not clever generation, just one lookup
// table instead of 24 separate compoundVariants blocks.
//
// Usage: cardColorStyles[color][variant].card / .thumbnail / .icon / .text

export interface CardColorClasses {
  card: string;
  thumbnail: string;
  icon: string;
  text: string;
}

export const cardColorStyles: Record<
  string,
  Record<"solid" | "outline", CardColorClasses>
> = {
  primary: {
    solid: {
      card: "bg-primary",
      thumbnail: "bg-primary-foreground/30",
      icon: "text-primary-foreground",
      text: "text-primary-foreground",
    },
    outline: {
      card: "bg-primary/10 dark:bg-primary/20 border border-primary/50",
      thumbnail: "bg-primary/15 dark:bg-primary/25",
      icon: "text-primary",
      text: "text-foreground",
    },
  },
  secondary: {
    solid: {
      card: "bg-secondary",
      thumbnail: "bg-secondary-foreground/30",
      icon: "text-secondary-foreground",
      text: "text-secondary-foreground",
    },
    outline: {
      card: "bg-secondary/10 dark:bg-secondary/20 border border-secondary/50",
      thumbnail: "bg-secondary/15 dark:bg-secondary/25",
      icon: "text-secondary",
      text: "text-foreground",
    },
  },
  accent: {
    solid: {
      card: "bg-accent",
      thumbnail: "bg-accent-foreground/30",
      icon: "text-accent-foreground",
      text: "text-accent-foreground",
    },
    outline: {
      card: "bg-accent/50 border border-muted-foreground/50",
      thumbnail: "bg-accent",
      icon: "text-accent-foreground",
      text: "text-foreground",
    },
  },
  neutral: {
    solid: {
      card: "bg-muted border border-muted",
      thumbnail: "bg-foreground/20",
      icon: "text-foreground",
      text: "text-foreground",
    },
    outline: {
      card: "bg-card border border-foreground/20",
      thumbnail: "bg-accent",
      icon: "text-accent-foreground",
      text: "text-foreground",
    },
  },
  success: {
    solid: {
      card: "bg-success",
      thumbnail: "bg-success-foreground/30",
      icon: "text-success-foreground",
      text: "text-success-foreground",
    },
    outline: {
      card: "bg-success/10 dark:bg-success/20 border border-success/50",
      thumbnail: "bg-success/15 dark:bg-success/25",
      icon: "text-success",
      text: "text-foreground",
    },
  },
  info: {
    solid: {
      card: "bg-info",
      thumbnail: "bg-info-foreground/30",
      icon: "text-info-foreground",
      text: "text-info-foreground",
    },
    outline: {
      card: "bg-info/10 dark:bg-info/20 border border-info/50",
      thumbnail: "bg-info/15 dark:bg-info/25",
      icon: "text-info",
      text: "text-foreground",
    },
  },
  warning: {
    solid: {
      card: "bg-warning",
      thumbnail: "bg-warning-foreground/30",
      icon: "text-warning-foreground",
      text: "text-warning-foreground",
    },
    outline: {
      card: "bg-warning/10 dark:bg-warning/20 border border-warning/50",
      thumbnail: "bg-warning/15 dark:bg-warning/25",
      icon: "text-warning",
      text: "text-foreground",
    },
  },
  destructive: {
    solid: {
      card: "bg-destructive",
      thumbnail: "bg-destructive-foreground/30",
      icon: "text-destructive-foreground",
      text: "text-destructive-foreground",
    },
    outline: {
      card: "bg-destructive/10 dark:bg-destructive/20 border border-destructive/50",
      thumbnail: "bg-destructive/15 dark:bg-destructive/25",
      icon: "text-destructive",
      text: "text-foreground",
    },
  },
  organic: {
    solid: {
      card: "bg-organic",
      thumbnail: "bg-organic-foreground/30",
      icon: "text-organic-foreground",
      text: "text-organic-foreground",
    },
    outline: {
      card: "bg-organic/10 dark:bg-organic/20 border border-organic/50",
      thumbnail: "bg-organic/15 dark:bg-organic/25",
      icon: "text-organic",
      text: "text-foreground",
    },
  },
  inorganic: {
    solid: {
      card: "bg-inorganic",
      thumbnail: "bg-inorganic-foreground/30",
      icon: "text-inorganic-foreground",
      text: "text-inorganic-foreground",
    },
    outline: {
      card: "bg-inorganic/10 dark:bg-inorganic/20 border border-inorganic/50",
      thumbnail: "bg-inorganic/15 dark:bg-inorganic/25",
      icon: "text-inorganic",
      text: "text-foreground",
    },
  },
  compost: {
    solid: {
      card: "bg-compost",
      thumbnail: "bg-compost-foreground/30",
      icon: "text-compost-foreground",
      text: "text-compost-foreground",
    },
    outline: {
      card: "bg-compost/10 dark:bg-compost/20 border border-compost/50",
      thumbnail: "bg-compost/15 dark:bg-compost/25",
      icon: "text-compost",
      text: "text-foreground",
    },
  },
  garden: {
    solid: {
      card: "bg-garden",
      thumbnail: "bg-garden-foreground/30",
      icon: "text-garden-foreground",
      text: "text-garden-foreground",
    },
    outline: {
      card: "bg-garden/10 dark:bg-garden/20 border border-garden/50",
      thumbnail: "bg-garden/15 dark:bg-garden/25",
      icon: "text-garden",
      text: "text-foreground",
    },
  },
};
