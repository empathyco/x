import type { TailwindHelpers } from '../types'
import { forEach } from '@empathyco/x-utils'

import components from './components'
import dynamicComponents from './dynamic-components'
import dynamicUtilities from './dynamic-utilities'
import xTheme from './theme'
import utilities from './utilities'

/**
 * Tailwind CSS 4 plugin for x-tailwind.
 */
export default {
  theme: {
    x: xTheme,
  },

  /**
   * Tailwind v4 plugin handler.
   */
  handler(
    helpers: TailwindHelpers & {
      addBase: (rules: Record<string, any>) => void
      addComponents: (rules: Record<string, any>) => void
      addUtilities: (rules: Record<string, any>) => void
      addVariant: (name: string, selector: string) => void
    },
  ) {
    /* Static components */
    helpers.addComponents(components(helpers))

    /* Dynamic components — now flattened into static output */
    forEach(dynamicComponents(helpers), (key, { styles }) => {
      helpers.addComponents({
        [key]: styles,
      })
    })

    /* Dynamic utilities — now static */
    forEach(dynamicUtilities(helpers), (key, { styles }) => {
      helpers.addUtilities({
        [key]: styles,
      })
    })

    /* Utilities */
    helpers.addUtilities(utilities(helpers))

    /* Variant */
    helpers.addVariant('selected', '&.x-selected')
  },
}
