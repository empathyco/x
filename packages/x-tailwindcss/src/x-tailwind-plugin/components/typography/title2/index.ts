import type { TailwindHelpers } from '../../../../types'
import { rename } from '@empathyco/x-utils'
import { titleDefault } from './default'
import { titleSizes } from './sizes'

/**
 * Returns the component `title2` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function title2(helpers: TailwindHelpers) {
  return {
    '.x-title2': {
      ...titleDefault(helpers),
      ...rename(
        {
          ...titleSizes(helpers),
        },
        { prefix: '&.x-title2-' },
      ),
    },
  }
}
