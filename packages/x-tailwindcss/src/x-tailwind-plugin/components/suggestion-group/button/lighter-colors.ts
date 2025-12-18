import type { TailwindHelpers } from '../../../../types'
import { rename } from '@empathyco/x-utils'
import { mapColors } from '../../../utils/map-colors'
/**
 * Returns the `color` variants for component `suggestion group button lighter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupLighterColors(helpers: TailwindHelpers) {
  return rename(
    mapColors(
      color => ({
        '--suggestion-group-button-color-50': color['50'],
        '.x-suggestion-group-button-lighter:hover': {
          color: 'var(--suggestion-group-button-color-50)',
        },
      }),
      helpers,
    ),
    { prefix: '.x-suggestion-group-lighter-' },
  )
}
