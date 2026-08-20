// components/primitives/index.ts
//
// One import line for screens: `import { Button, StatCard, ... } from
// "@/components/primitives"`. Nothing in this file or anything it
// re-exports is allowed to import a store or useNavigation — see the
// README at the repo root for the rule this enforces.

export { Button } from "./Button/Button";
export { IconButton } from "./Button/IconButton";

export { UserAvatar } from "./Avatar/UserAvatar";

export { SurfaceCard } from "./Card/SurfaceCard";
export { StatCard } from "./Card/StatCard";
export { ActionTile } from "./Card/ActionTile";
export { QuoteCard } from "./Card/QuoteCard";
export { SortableCard } from "./Card/SortableCard";

export { TextField } from "./Input/TextField";
export { SearchField } from "./Input/SearchField";
export { SelectField } from "./Input/SelectField";
export { TextAreaField } from "./Input/TextAreaField";
export { SegmentedControl } from "./Input/SegmentedControl";
export type { SegmentedControlOption } from "./Input/SegmentedControl";
export { FilterChips } from "./Input/FilterChips";
export { SortSelect } from "./Input/SortSelect";
export type {
  SortState,
  SortFieldOption,
  SortDirection,
} from "./Input/SortSelect";
export { PhotoPicker } from "./Input/PhotoPicker";

export { ProgressBar } from "./Feedback/ProgressBar";
export { EmptyState } from "./Feedback/EmptyState";

export { Screen } from "./Layout/Screen";
export { ScreenHeader } from "./Layout/ScreenHeader";
export { BottomPanel } from "./Layout/BottomPanel";
export { Drawer } from "./Layout/Drawer";
export { Spacer } from "./Layout/Spacer";
export { Modal } from "./Layout/Modal";

export { List } from "./List/List";
export type { ListItemData } from "./List/List";
export { ListSection } from "./List/ListSection";

export { GradientHeading } from "./Typography/AnimatedGradientHeading";
