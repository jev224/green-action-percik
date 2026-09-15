import { COLORS } from "./colors";

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
