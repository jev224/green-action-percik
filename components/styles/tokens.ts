// components/styles/tokens.ts
//
// Single source of truth for which semantic colors exist in the app.
// These map 1:1 to the CSS variables defined in global.css
// (--primary, --success, --organic, etc). Add a color there first,
// then add its name here — everything else (SurfaceCard, StatCard,
// ActionTile) reads from this list instead of hardcoding it per file.

export const SEMANTIC_COLORS = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "info",
  "warning",
  "destructive",
  "organic",
  "inorganic",
  "compost",
  "garden",
] as const;

export type SemanticColor = (typeof SEMANTIC_COLORS)[number];

export type SurfaceVariant = "solid" | "outline";
