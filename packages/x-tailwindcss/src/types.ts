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

export interface CSSRuleObject {
  [selector: string]: CSSRuleValue | string | number | undefined
}

/**
 * The helpers provided internally by our Tailwind plugin.
 * Tailwind CSS 4 no longer exposes `PluginAPI`,
 * so we recreate the pieces we need.
 */
export interface TailwindHelpers {
  theme: (path?: string, defaultValue?: any) => any
  addUtilities: (utilities: Record<string, any>) => void
  addComponents: (components: Record<string, any>) => void
  addBase: (base: Record<string, any>) => void
  addVariant: (name: string, definition: any) => void
}
