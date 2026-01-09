import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { rename } from '@empathyco/x-utils'
import { inputColors } from './colors'
import { inputDefault } from './default'
import { inputLine } from './line'
import { inputSizes } from './sizes'

/**
 * Returns the component `input` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function input(helpers: TailwindHelpers) {
  return {
    '.input': deepMerge(
      inputDefault(helpers),
      rename(
        {
          ...inputColors(helpers),
          ...inputSizes(helpers),
          ...inputLine(helpers),
        },
        {
          prefix: '&.input-',
        },
      ),
    ),
  }
}
