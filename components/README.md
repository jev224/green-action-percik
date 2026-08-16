# Component structure

```
components/
  ui/            gluestack primitives — not included in this zip, unchanged
  primitives/    dumb, reusable, presentational. NEVER imports a store or useNavigation.
  domain/        app-specific. Composed from primitives/. Store + navigation are allowed here.
  styles/        shared design tokens (colors, per-color card styling)
hooks/           unchanged except import-path fixes
constants/       unchanged
```

## The 3 rules every component follows

1. **One styling strategy.** `className` merged via `cn()` for single-surface
   components. `SurfaceCard` + `styles/cardColorStyles.ts` for anything that
   needs the 12-color × 2-variant treatment. No template-string
   concatenation (`` `foo ${x ?? ""}` ``) anywhere — that pattern silently
   breaks the moment `x` is falsy-but-valid, and it's inconsistent with the
   rest of the app either way.

2. **One action shape: `onPress`.** Nothing in `primitives/` calls
   `useNavigation()` or a store hook. If a screen needs a tap to navigate,
   the *screen* calls `navigateTo()` (or uses `domain/nav/LinkButton`) and
   hands the result down as `onPress`. This is what fixes `StudentList`
   being unreusable — it used to decide what tapping a row *meant*
   (save to store, then push a specific route) instead of just reporting
   that a row was tapped.

3. **One naming convention: `<Purpose><Type>.tsx`.** `TextField`,
   `SurfaceCard`, `StudentListItem`. No `UI`-prefixed names, no ambiguous
   pairs like the old `ProfileHeader` vs `UserAvatarHeading` where you had
   to open both files to know which one you wanted.

## Why `primitives/` vs `domain/` specifically

A component belongs in `primitives/` if you could paste it into a
completely different app and it would still make sense — it only knows
about props and design tokens. It goes in `domain/` the moment it needs to
know this app's routes, this app's store, or this app's specific data
shapes (`StudentData`, a role type, etc).

This is also why `BackButton` and `LinkButton` — which look like trivial
one-line wrappers — live in `domain/nav/` and not `primitives/Button/`.
They're one `useNavigation()` call away from being app-specific.

## What "SurfaceCard" buys you

`ActionTile` and `StatCard` used to be two unrelated files, each
hand-declaring the same 12-color/2-variant matrix (`ActionCard.tsx` and
`StatisticCard.tsx` were ~280 lines each). They now both call
`SurfaceCard`, which resolves `{ color, variant }` against one shared
lookup table (`styles/cardColorStyles.ts`). Add a new card style in the
future and you write it once, not twice.

Note on that lookup table: NativeWind extracts Tailwind class names
**statically at build time**, so `` `bg-${color}` `` template literals
silently fail on device even though they look correct in the editor. That's
a real constraint, not a style preference — which is why the color classes
in `cardColorStyles.ts` are still spelled out as literal strings rather
than generated. What changed is *where* they're spelled out: one table
instead of scattered across two files' `compoundVariants` arrays.

## Files kept as-is (already fine)

`SortSelect`, `PhotoPicker`, `QuoteCard`, `ProgressBar`, `ListSection` —
all just relocated + switched to named exports. No behavior changes.

## Not implemented, flagged rather than faked

- `BottomSheet` — was already an unimplemented stub before this refactor.
  Left it clearly marked instead of inventing a fake version.
- `Screen`'s old `canRefresh`/`onRefresh` props were declared but never
  wired to anything — dropped rather than carried forward as dead code.
- `PhotoPicker`'s `MAX_FILE_SIZE_BYTES = 5 * 1024` compresses to roughly
  thumbnail quality. Left the number alone since I don't know your target,
  but flagged in the file — worth a deliberate decision.

See `MIGRATION.md` for the full old-path → new-path map.
