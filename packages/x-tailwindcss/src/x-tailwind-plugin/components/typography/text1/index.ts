import type { TailwindHelpers } from '../../../../types'
import { rename } from '@empathyco/x-utils'
import { textDefault } from './default'
import { textSizes } from './sizes'

/**
 * Returns the component `text1` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function text1(helpers: TailwindHelpers) {
  return {
    '.x-text1': {
      ...textDefault(helpers),
      ...rename(
        {
          ...textSizes(helpers),
        },
        { prefix: '&.x-text1-' },
      ),
    },
  }
}
