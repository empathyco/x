import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { rename } from '@empathyco/x-utils'
import { buttonColors } from './colors'
import { buttonDefault } from './default'
import { buttonDisabled } from './disabled'
import { buttonGhost } from './ghost'
import { buttonLayouts } from './layouts'
import { buttonLink } from './link'
import { buttonOutlined } from './outlined'
import { buttonSizes } from './sizes'
import { buttonTight } from './tight'

/**
 * Returns the component `button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function button(helpers: TailwindHelpers) {
  return {
    '.x-button': deepMerge(
      buttonDefault(helpers),
      rename(
        {
          ...buttonColors(helpers),
          ...buttonSizes(helpers),
          ...buttonLayouts(helpers),
          ...buttonOutlined(helpers),
          ...buttonLink(helpers),
          ...buttonGhost(helpers),
          ...buttonTight(helpers),
        },
        { prefix: '&.x-button-' },
      ),
      buttonDisabled(helpers),
    ),
  }
}
