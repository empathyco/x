import type { TailwindHelpers } from '../../../types'
import { mapColors } from '../../utils/map-colors'

/**
 * Returns the `colors` variants for component `progress-bar`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function progressBarColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      '--progress-bar-color-50': color['50'],
    }),
    helpers,
  )
}
