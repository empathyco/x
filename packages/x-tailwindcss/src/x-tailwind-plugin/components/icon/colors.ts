import type { TailwindHelpers } from '../../../types'
import { map, rename } from '@empathyco/x-utils'
import { mapColors } from '../../utils/map-colors'

/**
 * Returns the `color` variants for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function iconColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      color: color[50],
      ...rename(
        map(color, (shadeName, shadeColor) => ({
          color: shadeColor,
        })),
        { prefix: `&.x-icon-` },
      ),
    }),
    helpers,
  )
}
