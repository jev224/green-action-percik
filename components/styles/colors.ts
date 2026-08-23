export const COLORS = {
  primary: {
    solid: {
      surface: "bg-primary",
      surfaceInner: "bg-foreground/50",
      icon: "text-primary-foreground",
      text: "text-primary-foreground",
    },
    outline: {
      surface: "bg-primary/10 dark:bg-primary/20 border border-primary/25",
      surfaceInner: "bg-primary/15 dark:bg-primary/25",
      icon: "text-primary",
      text: "text-foreground",
    },
  },

  secondary: {
    solid: {
      surface: "bg-secondary",
      surfaceInner: "bg-secondary-foreground/30",
      icon: "text-secondary-foreground",
      text: "text-secondary-foreground",
    },
    outline: {
      surface:
        "bg-secondary/10 dark:bg-secondary/20 border border-secondary/50",
      surfaceInner: "bg-secondary/15 dark:bg-secondary/25",
      icon: "text-secondary",
      text: "text-foreground",
    },
  },

  accent: {
    solid: {
      surface: "bg-accent",
      surfaceInner: "bg-accent-foreground/30",
      icon: "text-accent-foreground",
      text: "text-accent-foreground",
    },
    outline: {
      surface: "bg-accent/10 dark:bg-accent/20 border border-accent/50",
      surfaceInner: "bg-accent/15 dark:bg-accent/25",
      icon: "text-accent",
      text: "text-foreground",
    },
  },

  neutral: {
    solid: {
      surface: "bg-card border-card",
      surfaceInner: "bg-foreground/20",
      icon: "text-foreground",
      text: "text-foreground",
    },
    outline: {
      surface: "bg-muted/50 border-foreground/20",
      surfaceInner: "bg-accent/70",
      icon: "text-accent-foreground/80",
      text: "text-foreground",
    },
  },

  success: {
    solid: {
      surface: "bg-success",
      surfaceInner: "bg-success-foreground/30",
      icon: "text-success-foreground",
      text: "text-success-foreground",
    },
    outline: {
      surface: "bg-success/10 dark:bg-success/20 border border-success/50",
      surfaceInner: "bg-success/15 dark:bg-success/25",
      icon: "text-success",
      text: "text-foreground",
    },
  },

  info: {
    solid: {
      surface: "bg-info",
      surfaceInner: "bg-info-foreground/30",
      icon: "text-info-foreground",
      text: "text-info-foreground",
    },
    outline: {
      surface: "bg-info/10 dark:bg-info/20 border border-info/50",
      surfaceInner: "bg-info/15 dark:bg-info/25",
      icon: "text-info",
      text: "text-foreground",
    },
  },

  warning: {
    solid: {
      surface: "bg-warning",
      surfaceInner: "bg-warning-foreground/30",
      icon: "text-warning-foreground",
      text: "text-warning-foreground",
    },
    outline: {
      surface: "bg-warning/10 dark:bg-warning/20 border border-warning/50",
      surfaceInner: "bg-warning/15 dark:bg-warning/25",
      icon: "text-warning",
      text: "text-foreground",
    },
  },

  destructive: {
    solid: {
      surface: "bg-destructive",
      surfaceInner: "bg-destructive-foreground/30",
      icon: "text-destructive-foreground",
      text: "text-destructive-foreground",
    },
    outline: {
      surface:
        "bg-destructive/10 dark:bg-destructive/20 border border-destructive/50",
      surfaceInner: "bg-destructive/15 dark:bg-destructive/25",
      icon: "text-destructive",
      text: "text-foreground",
    },
  },

  organic: {
    solid: {
      surface: "bg-organic",
      surfaceInner: "bg-organic-foreground/30",
      icon: "text-organic-foreground",
      text: "text-organic-foreground",
    },
    outline: {
      surface: "bg-organic/10 dark:bg-organic/20 border border-organic/50",
      surfaceInner: "bg-organic/15 dark:bg-organic/25",
      icon: "text-organic",
      text: "text-foreground",
    },
  },

  inorganic: {
    solid: {
      surface: "bg-inorganic",
      surfaceInner: "bg-inorganic-foreground/30",
      icon: "text-inorganic-foreground",
      text: "text-inorganic-foreground",
    },
    outline: {
      surface:
        "bg-inorganic/10 dark:bg-inorganic/20 border border-inorganic/50",
      surfaceInner: "bg-inorganic/15 dark:bg-inorganic/25",
      icon: "text-inorganic",
      text: "text-foreground",
    },
  },

  compost: {
    solid: {
      surface: "bg-compost",
      surfaceInner: "bg-compost-foreground/30",
      icon: "text-compost-foreground",
      text: "text-compost-foreground",
    },
    outline: {
      surface: "bg-compost/10 dark:bg-compost/20 border border-compost/50",
      surfaceInner: "bg-compost/15 dark:bg-compost/25",
      icon: "text-compost",
      text: "text-foreground",
    },
  },

  garden: {
    solid: {
      surface: "bg-garden",
      surfaceInner: "bg-garden-foreground/30",
      icon: "text-garden-foreground",
      text: "text-garden-foreground",
    },
    outline: {
      surface: "bg-garden/10 dark:bg-garden/20 border border-garden/50",
      surfaceInner: "bg-garden/15 dark:bg-garden/25",
      icon: "text-garden-foreground",
      text: "text-foreground",
    },
  },
} as const;
