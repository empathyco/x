import type { TailwindHelpers } from '../../../../types'
import { rename } from '@empathyco/x-utils'
import { titleDefault } from './default'
import { titleSizes } from './sizes'

/**
 * Returns the component `title1` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function title1(helpers: TailwindHelpers) {
  return {
    '.title1': {
      ...titleDefault(helpers),
    },
    ...rename(
      {
        ...titleSizes(helpers),
      },
      { prefix: '.title1-' },
    ),
  }
}
