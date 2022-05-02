import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import { TailwindPluginFn } from 'tailwindcss/plugin';
import { ReturnOfComponents } from './helpers/components';
import { ReturnOfDynamicComponents } from './helpers/dynamic-components';
import { ReturnOfDynamicUtilities } from './helpers/dynamic-utilities';
import { ReturnOfUtilities } from './helpers/utilities';

/**
 * Represents a `CSS` variable name.
 *
 * @example
 * ```typescript
 * const primaryColor: CSSVariable = '--color-primary';
 * ```
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
 * @internal
 */
type CSSNestedSelector = `&${string}`;

/**
 * Represents the different `CSS` styling options for a component.
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
 * @public
 */
export type CSSStyleOptions = {
  [Key: CSSClassSelector | CSSNestedSelector]: CSSStyleOptions | Partial<CSSStyleDeclaration>;
  [Key: CSSVariable]: string & Partial<TailwindHelpers>;
};

/**
 * An object with the styles and values to create a dynamic component or utility with.
 *
 * @public
 */
export type DynamicCSSStylesOptions = Dictionary<{
  styles: (value: unknown) => CSSStyleOptions;
  values?: string;
}>;

/**
 * All the tailwind helpers provided by the plugin.
 *
 * @public
 */
export type TailwindHelpers = Parameters<TailwindPluginFn>[0];

/**
 * Represents the return type of {@link PluginOptions.components}.
 *
 * @public
 */
export type ComponentsDefinition = DeepPartial<ReturnOfComponents> | CSSStyleOptions;

/**
 * Represents the return type of {@link PluginOptions.utilities}.
 *
 * @public
 */
export type UtilitiesDefinition = DeepPartial<ReturnOfUtilities> | CSSStyleOptions;

/**
 * Represents the return type of {@link PluginOptions.dynamicComponents}.
 *
 * @public
 */
export type DynamicComponentsDefinition =
  | DeepPartial<ReturnOfDynamicComponents>
  | DynamicCSSStylesOptions;

/**
 * Represents the return type of {@link PluginOptions.dynamicUtilities}.
 *
 * @public
 */
export type DynamicUtilitiesDefinition =
  | DeepPartial<ReturnOfDynamicUtilities>
  | DynamicCSSStylesOptions;

/**
 * Options to create a plugin.
 *
 * @public
 */
export interface PluginOptions {
  /**
   * Registers new static components or modify the existing ones.
   */
  components?: (helpers: Partial<TailwindHelpers>) => ComponentsDefinition;
  /**
   * Registers a new dynamic component styles or replaces the existing ones.
   */
  dynamicComponents?: (helpers: Partial<TailwindHelpers>) => DynamicComponentsDefinition;
  /**
   * Registers new static utilities or modify the existing ones.
   */
  utilities?: (helpers: Partial<TailwindHelpers>) => UtilitiesDefinition;
  /**
   * Registers a new dynamic utilities styles or replaces the existing ones.
   */
  dynamicUtilities?: (helpers: Partial<TailwindHelpers>) => DynamicUtilitiesDefinition;
  /**
   * Helper to add extra functionalities.
   */
  extra?: (helpers: Partial<TailwindHelpers>) => Partial<TailwindHelpers>;
  /**
   * Helper to define new theme or modify the existing one.
   */
  theme?: Dictionary;
}
