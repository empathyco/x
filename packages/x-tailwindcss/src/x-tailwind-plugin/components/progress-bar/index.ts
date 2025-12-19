import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { rename } from '@empathyco/x-utils'
import { progressBarColors } from './colors'
import { progressBarDefault } from './default'
import { progressBarSizes } from './sizes'

/**
 * Returns the component `progress-bar` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function progressBar(helpers: TailwindHelpers) {
  return {
    '.x-progress-bar': deepMerge(progressBarDefault(helpers)),
    ...rename(
      {
        ...progressBarColors(helpers),
        ...progressBarSizes(helpers),
      },
      { prefix: '.x-progress-bar-' },
    ),
  }
}
