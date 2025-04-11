import type { ExtractPath } from '@empathyco/x-utils'
import type { Config } from 'tailwindcss'
import type { PluginAPI } from 'tailwindcss/types/config'
import type Theme from './x-tailwind-plugin/theme'

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
type CssVariable = `--${string}`

/**
 * Represents a `Css` class selector.
 *
 * @example
 * ```typescript
 * const btnClass: CssClassSelector = '.x-btn';
 * ```
 *
 * @internal
 */
type CssClassSelector = `.${string}`
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
type CssNestedSelector = `&${string}`
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
type CssPseudoSelector = `:${string}`

/**
 * Represents the different `CSS` styling options for a component.
 *
 * @example
 * ```typescript
 * const cssOptions: CssStyleOptions = {
 *   '--color-lead': 'blue',
 *   '.x-btn': {
 *     '&--lead': {
 *       color: 'var(--color-lead)',
 *       gap: theme('x.spacing.2')
 *     }
 *   }
 * }
 * ```
 *
 * @public
 */
export interface CssStyleOptions {
  [Key: CssClassSelector | CssNestedSelector | CssPseudoSelector]:
    | CssStyleOptions
    | Partial<CSSStyleDeclaration>
  [Key: CssVariable]: string & Partial<TailwindHelpers>
}

/**
 * All the tailwind helpers provided by the plugin.
 *
 * @public
 */
export type TailwindHelpers = PluginAPI & {
  theme: <TDefaultValue = Config['theme']>(
    path?: ExtractPath<typeof Theme>,
    defaultValue?: TDefaultValue,
  ) => TDefaultValue
}
