import type { TailwindHelpers } from '../types'
import { forEach } from '@empathyco/x-utils'
import plugin from 'tailwindcss/plugin'
import components from './components'
import dynamicComponents from './dynamic-components'
import dynamicUtilities from './dynamic-utilities'
import xTheme from './theme'
import utilities from './utilities'

/**
 * Defines the x-tailwind plugin as a Tailwind {@link plugin} that can be invoked passing a
 * configuration object to customize it. The plugin is bundled with generated static and dynamic
 * components and utilities, all based on the plugin's theme.
 *
 * @public
 */
export default plugin.withOptions(
  () => {
    /**
     * Registers the generated CSS for the components and utilities of the plugin to the
     * respective Tailwind layer. It depends on the plugin's theme, affecting
     * the color, spacing, etc... Of the styles generated in this step.
     *
     * @param helpers - The {@link TailwindHelpers}.
     * @internal
     */
    return function (helpers: TailwindHelpers) {
      /* Add components */
      helpers.addComponents(components(helpers), { respectPrefix: false })
      /* Add dynamic components */
      forEach(dynamicComponents(helpers), (key, { styles, values }) => {
        helpers.matchComponents(
          { [key]: styles },
          { respectPrefix: false, values: values ?? undefined },
        )
      })
      /* Add dynamic utilities */
      forEach(dynamicUtilities(helpers), (key, { styles, values }) => {
        helpers.matchUtilities(
          { [key]: styles },
          { respectPrefix: false, values: values ?? undefined },
        )
      })
      /* Add utilities */
      helpers.addUtilities(utilities(helpers), { respectPrefix: false })
      /* Add variant to selected */
      helpers.addVariant('selected', '&.x-selected')
    }
  },
  () => {
    return {
      theme: { x: xTheme },
    }
  },
)
