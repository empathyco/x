import type { TailwindHelpers } from '../../../types'
import { rename } from '@empathyco/x-utils'
import { iconBackgroundColors } from './background-colors'
import { iconColors } from './colors'
import { iconDefault } from './default'
import { iconSharp } from './sharp'
import { iconSizes } from './sizes'
import { iconStrokeWidths } from './stroke-widths'

/**
 * Returns the component `icon` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function icon(helpers: TailwindHelpers) {
  return {
    '.icon': Object.assign(iconDefault(helpers)),
    ...rename(
      {
        ...iconColors(helpers),
        ...iconBackgroundColors(helpers),
        ...iconSizes(helpers),
        ...iconSharp(helpers),
        ...iconStrokeWidths(helpers),
      },
      { prefix: '.icon-' },
    ),
  }
}
