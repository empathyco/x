import { Dictionary } from '@empathyco/x-utils';
import { TailwindPluginFn } from 'tailwindcss/plugin';
import { AnyFunction } from '../../x-utils';

/**
 * The variable name selector in CSS.
 */
type VarSelector = `--${string}`;
/**
 * The child selector for a CSS element.
 */
type ChildBlockKey = `.${string}` | `&${string}`;
/**
 * The different possibles CSS keys for a component.
 */
export type StyleOptions = {
  [Key: ChildBlockKey]: StyleOptions & Partial<CSSStyleDeclaration>;
  [Key: VarSelector]: string | AnyFunction;
};

/**
 * An object with the styles and values to create a dynamic component or utility with.
 */
export type DynamicStylesOptions = Dictionary<{
  styles: (value: unknown) => StyleOptions;
  values?: string;
}>;

/**
 * All the tailwind helpers provided by the plugin.
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
