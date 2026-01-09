import type { TailwindHelpers } from '../../../../types'
import { rename } from '@empathyco/x-utils'
import { textDefault } from './default'
import { textSizes } from './sizes'

/**
 * Returns the component `text2` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function text2(helpers: TailwindHelpers) {
  return {
    '.text2': {
      ...textDefault(helpers),
    },
    ...rename(
      {
        ...textSizes(helpers),
      },
      { prefix: '&.text2-' },
    ),
  }
}
