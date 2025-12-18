import type { Config, PluginAPI, Theme } from 'tailwindcss/plugin'
import { ExtractPath } from '@empathyco/x-utils'

/**
 * Represents a `CSS` variable name.
 */
type CssVariable = `--${string}`

/**
 * Represents a `CSS` class selector.
 */
type CssClassSelector = `.${string}`

/**
 * Represents a `CSS` nested selector.
 */
type CssNestedSelector = `&${string}`

/**
 * Represents a `CSS` pseudo selector.
 */
type CssPseudoSelector = `:${string}`

/**
 * Represents the different CSS styling options for a component.
 */
export interface CssStyleOptions {
  [key: CssClassSelector | CssNestedSelector | CssPseudoSelector]:
    | CssStyleOptions
    | Record<string, any>

  [key: CssVariable]: string
}

export interface CSSRuleValue {
  [key: string]: string | number | CSSRuleValue | undefined
}

/**
 * Minimal replacement for Tailwind v3's CSSRuleObject.
 */
export interface CSSRuleObject {
  [selector: string]: CSSRuleValue | string | number | undefined
}

/**
 * The helpers provided internally by our Tailwind plugin.
 * Tailwind CSS 4 no longer exposes `PluginAPI`,
 * so we recreate the pieces we need.
 */
export type TailwindHelpers = PluginAPI & {
  theme: <TDefaultValue = Config['theme']>(
    path?: ExtractPath<typeof Theme>,
    defaultValue?: TDefaultValue,
  ) => TDefaultValue
}
