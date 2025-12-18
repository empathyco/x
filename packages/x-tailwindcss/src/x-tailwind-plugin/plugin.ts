import type { PluginAPI } from 'tailwindcss/plugin'
import type { TailwindHelpers } from '../types'

import { forEach } from '@empathyco/x-utils'
import plugin from 'tailwindcss/plugin'
import components from './components'
import { variables } from './components/variables'
import dynamicComponents from './dynamic-components'

import dynamicUtilities from './dynamic-utilities'
import xTheme from './theme'
import utilities from './utilities'

function createHelpers(api: PluginAPI): TailwindHelpers & PluginAPI {
  return api as TailwindHelpers & PluginAPI
}

const _xTailwindPlugin = plugin(
  api => {
    const helpers = createHelpers(api)

    helpers.addBase({ ...variables(helpers) })
    helpers.addComponents(components(helpers))

    forEach(dynamicComponents(helpers), (key, { styles }) => {
      helpers.addComponents({ [key]: styles })
    })

    forEach(dynamicUtilities(helpers), (key, { styles }) => {
      helpers.addUtilities({ [key]: styles })
    })

    helpers.addUtilities(utilities(helpers))

    helpers.addVariant('selected', '&.x-selected')
  },
  {
    theme: {
      x: xTheme,
    },
  },
)

const xTailwindPlugin: unknown = _xTailwindPlugin

export default xTailwindPlugin
