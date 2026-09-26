// components/primitives/index.ts
//
// One import line for screens: `import { Button, StatCard, ... } from
// "@/components/primitives"`. Nothing in this file or anything it
// re-exports is allowed to import a store or useNavigation — see the
// README at the repo root for the rule this enforces.

export { UserAvatar } from "./Avatar/UserAvatar";
export { Button } from "./Button/Button";
export { IconButton } from "./Button/IconButton";
export { ActionTile } from "./Card/ActionTile";
export { SortableCard } from "./Card/SortableCard";
export { StatCard } from "./Card/StatCard";
export { SurfaceCard } from "./Card/SurfaceCard";
export { EmptyState } from "./Feedback/EmptyState";
export { ProgressBar } from "./Feedback/ProgressBar";
export { Spinner } from "./Feedback/Spinner";
export { FilterChips } from "./Input/FilterChips";
export { PhotoPicker } from "./Input/PhotoPicker";
export { SearchField } from "./Input/SearchField";
export type { SegmentedControlOption } from "./Input/SegmentedControl";
export { SegmentedControl } from "./Input/SegmentedControl";
export { SelectField } from "./Input/SelectField";
export type {
	SortDirection,
	SortFieldOption,
	SortState,
} from "./Input/SortSelect";
export { SortSelect } from "./Input/SortSelect";
export { TextAreaField } from "./Input/TextAreaField";
export { TextField } from "./Input/TextField";
export { BottomPanel } from "./Layout/BottomPanel";
export { Drawer } from "./Layout/Drawer";
export { HomeCarousel } from "./Layout/HomeCarousel";
export { Modal } from "./Layout/Modal";
export { Screen } from "./Layout/Screen";
export { ScreenHeader } from "./Layout/ScreenHeader";
export { SmoothActionSheet } from "./Layout/SmoothActionSheet";
export { Spacer } from "./Layout/Spacer";
export type { ListItemData } from "./List/List";
export { List } from "./List/List";
export { ListSection } from "./List/ListSection";
export { GradientHeading } from "./Typography/AnimatedGradientHeading";
