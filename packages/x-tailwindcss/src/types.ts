import { DeepPartial, Dictionary, ExtractPath } from '@empathyco/x-utils';
import { PluginAPI } from 'tailwindcss/types/config';
import { Config } from 'tailwindcss';
import { ReturnOfComponents } from './x-tailwind-plugin/components';
import { ReturnOfDynamicComponents } from './x-tailwind-plugin/dynamic-components';
import { ReturnOfDynamicUtilities } from './x-tailwind-plugin/dynamic-utilities';
import { ReturnOfUtilities } from './x-tailwind-plugin/utilities';
import Theme from './x-tailwind-plugin/theme';

/**
 * Represents a `CSS` variable name.
 *
 * @example
 * ```typescript
 * const leadColor: CssVariable = '--color-lead';
 * ```
 *
 * @internal
 */
type CssVariable = `--${string}`;

/**
 * Represents a `Css` class selector.
 *
 * @example
 * ```typescript
 * const btnClass: CssClassSelector = '.btn';
 * ```
 *
 * @internal
 */
type CssClassSelector = `.${string}`;
/**
 * Represents a `CSS` nested selector.
 *
 * @example
 * ```typescript
 * const nestedSelector: CssNestedSelector = '&--lead';
 * ```
 *
 * @internal
 */
type CssNestedSelector = `&${string}`;
/**
 * Represents a `CSS` pseudo selector.
 *
 * @example
 * ```typescript
 * const rootSelector: CssPseudoSelector = ':root';
 * ```
 *
 * @internal
 */
type CssPseudoSelector = `:${string}`;

/**
 * Represents the different `CSS` styling options for a component.
 *
 * @example
 * ```typescript
 * const cssOptions: CssStyleOptions = {
 *   '--color-lead': 'blue',
 *   '.btn': {
 *     '&--lead': {
 *       color: 'var(--color-lead)',
 *       gap: theme('spacing.2')
 *     }
 *   }
 * }
 * ```
 *
 * @public
 */
export type CssStyleOptions = {
  [Key: CssClassSelector | CssNestedSelector | CssPseudoSelector]:
    | CssStyleOptions
    | Partial<CSSStyleDeclaration>;
  [Key: CssVariable]: string & Partial<TailwindHelpers>;
};

/**
 * An object with the styles and values to create a dynamic component or utility with.
 *
 * @public
 */
export type DynamicCssStylesOptions = Dictionary<{
  styles: (value: unknown) => CssStyleOptions;
  values?: Dictionary<unknown>;
}>;

/**
 * All the tailwind helpers provided by the plugin.
 *
 * @public
 */
export type TailwindHelpers = PluginAPI & {
  theme: <TDefaultValue = Config['theme']>(
    path?: ExtractPath<typeof Theme>,
    defaultValue?: TDefaultValue
  ) => TDefaultValue;
};

/**
 * Represents the return type of {@link PluginOptions.components}.
 *
 * @public
 */
export type ComponentsDefinition = DeepPartial<ReturnOfComponents> | CssStyleOptions;

/**
 * Represents the return type of {@link PluginOptions.utilities}.
 *
 * @public
 */
export type UtilitiesDefinition = DeepPartial<ReturnOfUtilities> | CssStyleOptions;

/**
 * Represents the return type of {@link PluginOptions.dynamicComponents}.
 *
 * @public
 */
export type DynamicComponentsDefinition =
  | DeepPartial<ReturnOfDynamicComponents>
  | DynamicCssStylesOptions;

/**
 * Represents the return type of {@link PluginOptions.dynamicUtilities}.
 *
 * @public
 */
export type DynamicUtilitiesDefinition =
  | DeepPartial<ReturnOfDynamicUtilities>
  | DynamicCssStylesOptions;

/**
 * Options to create a plugin.
 *
 * @public
 */
export interface PluginOptions {
  /**
   * Registers new static components or modify the existing ones.
   */
  components?: (helpers: TailwindHelpers) => ComponentsDefinition;
  /**
   * Registers a new dynamic component styles or replaces the existing ones.
   */
  dynamicComponents?: (helpers: TailwindHelpers) => DynamicComponentsDefinition;
  /**
   * Registers new static utilities or modify the existing ones.
   */
  utilities?: (helpers: TailwindHelpers) => UtilitiesDefinition;
  /**
   * Registers a new dynamic utilities styles or replaces the existing ones.
   */
  dynamicUtilities?: (helpers: TailwindHelpers) => DynamicUtilitiesDefinition;
  /**
   * Helper to add extra functionalities.
   */
  extra?: (helpers: TailwindHelpers) => Partial<TailwindHelpers>;
  /**
   * Helper to define new theme or modify the existing one.
   */
  theme?: DeepPartial<typeof Theme> | Config['theme'];
}
