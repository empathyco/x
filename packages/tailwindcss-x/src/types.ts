import { Dictionary } from '@empathyco/x-utils';
import { TailwindPluginFn } from 'tailwindcss/plugin';

/**
 * Represents a `CSS` variable name.
 *
 * @example
 * ```typescript
 * const primaryColor: CSSVariable = '--color-primary';
 * ```
 *
 * @internal
 */
type CSSVariable = `--${string}`;

/**
 * Represents a `CSS` class selector.
 *
 * @example
 * ```typescript
 * const btnClass: CSSClassSelector = '.btn';
 * ```
 *
 * @internal
 */
type CSSClassSelector = `.${string}`;
/**
 * Represents a `CSS` nested selector.
 *
 * @example
 * ```typescript
 * const nestedSelector: CSSNestedSelector = '&--primary';
 * ```
 *
 * @internal
 */
type CSSNestedSelector = `&${string}`;

/**
 * Represents the different possible `CSS` styling options for a component.
 *
 * @example
 * ```typescript
 * const cssOptions: CSSStyleOptions = {
 *   '--color-primary': 'blue',
 *   '.btn': {
 *     '&--primary': {
 *       color: 'var(--color-primary)',
 *       gap: theme('spacing.2')
 *     }
 *   }
 * }
 * ```
 */
export type StyleOptions = {
  [Key: CSSClassSelector | CSSNestedSelector]: StyleOptions | Partial<CSSStyleDeclaration>;
  [Key: CSSVariable]: string & Partial<TailwindHelpers>;
};

/**
 * An object with the styles and values to create a dynamic component or utility with.
 *
 * @public
 */
export type DynamicStylesOptions = Dictionary<{
  styles: (value: unknown) => StyleOptions;
  values?: string;
}>;

/**
 * All the tailwind helpers provided by the plugin.
 *
 * @public
 */
export type TailwindHelpers = Parameters<TailwindPluginFn>[0];

/**
 * Options to create a plugin.
 *
 * @public
 */
export interface PluginOptions {
  /**
   * Registers new static components or modify the existing ones.
   */
  components?: (helpers: Partial<TailwindHelpers>) => StyleOptions;
  /**
   * Registers a new dynamic component styles or replaces the existing ones.
   */
  dynamicComponents?: (helpers: Partial<TailwindHelpers>) => DynamicStylesOptions;
  /**
   * Registers new static utilities or modify the existing ones.
   */
  utilities?: (helpers: Partial<TailwindHelpers>) => StyleOptions;
  /**
   * Registers a new dynamic utilities styles or replaces the existing ones.
   * */
  dynamicUtilities?: (helpers: Partial<TailwindHelpers>) => DynamicStylesOptions;
  /**
   * Helper to add extra functionalities.
   */
  extra?: (helpers: Partial<TailwindHelpers>) => Partial<TailwindHelpers>;
  /**
   * Helper to define new theme or modify the existing one.
   */
  theme?: Dictionary;
}
