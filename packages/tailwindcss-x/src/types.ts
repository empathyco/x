import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import { TailwindPluginFn } from 'tailwindcss/plugin';
import components from './helpers/components';

/**
 * The variable name selector in CSS.
 */
type VarSelector = `--${string}`;
/**
 * The child selector for a CSS element.
 */
type ChildBlockKey = `.${string}` | `&${string}`;
/**
 * Gives the different possibles CSS keys for a component.
 */
type ComponentsCSS = {
  [Key: ChildBlockKey]: ComponentsCSS & Partial<CSSStyleDeclaration>;
  [Key: VarSelector]: string;
};
/**
 * TODO.
 */
export type ComponentsDefinition = DeepPartial<ReturnType<typeof components>> | ComponentsCSS;
/**
 * Gives the different helpers that can be used inside the plugin.
 */
export type TailwindHelpers = Parameters<TailwindPluginFn>[0];
/**
 * Types of value to be used in {@link Options."type" }.
 */
type ValueType =
  | 'any'
  | 'color'
  | 'url'
  | 'image'
  | 'length'
  | 'percentage'
  | 'position'
  | 'lookup'
  | 'generic-name'
  | 'family-name'
  | 'number'
  | 'line-width'
  | 'absolute-size'
  | 'relative-size'
  | 'shadow';
/**
 * Defines a configuration for the dynamic functions.
 */
type Options = {
  respectPrefix: boolean;
  respectImportant: boolean;
  type: ValueType | ValueType[];
  values: Record<string, unknown>;
  supportsNegativeValues: boolean;
};
/**
 * Defines a tuple where the first value is an object of default values to be created
 * and the second one is the options that are going to be applied to those values.
 *
 * @example
 * ```typescript
 *   const dynamicComponents: DynamicOptions = [
 *   {
 *     btn: (value: any) => ({
 *         backgroundColor: value['50']
 *      }),
 *   },
 *   {
 *     values: theme('colors')
 *   }
 *   ]
 * ```
 */
export type DynamicOptions = [Record<string, (value: any) => unknown>, Partial<Options>] | [];
/**
 * Options to create a plugin.
 *
 * @public
 */
export interface PluginOptions {
  /**
   * Helper to register new static component styles or modify the existing ones.
   */
  components?: (helpers: TailwindHelpers) => ComponentsDefinition;
  /**
   * Helper to register new dynamic component styles or modify the existing ones.
   * */
  dynamicComponents?: (helpers: TailwindHelpers) => DynamicOptions;
  /**
   * Helper to register new static utilities styles or modify the existing ones.
   * */
  utilities?: (helpers: TailwindHelpers) => ComponentsDefinition;
  /**
   * Helper to register new dynamic utilities styles or modify the existing ones.
   * */
  dynamicUtilities?: (helpers: TailwindHelpers) => DynamicOptions;
  /**
   * Helper to add extra functionalities.
   */
  extra?: (helpers: TailwindHelpers) => Partial<TailwindHelpers>;
  /**
   * Helper to define new theme or modify the existing one.
   */
  theme?: Dictionary;
}
