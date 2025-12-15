import type { TailwindHelpers } from '../../../types'
import { map, rename } from '@empathyco/x-utils'
import { mapColors } from '../../utils/map-colors'

/**
 * Returns the `background color` variants for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function iconBackgroundColors(helpers: TailwindHelpers) {
  return {
    bg: rename(
      mapColors(
        color => ({
          '[stroke="#fff"]': { stroke: color['50'] },
          '[fill="#fff"]': { fill: color['50'] },
          ...rename(
            map(color, (shadeName, shadeColor) => ({
              '[stroke="#fff"]': { stroke: shadeColor },
              '[fill="#fff"]': { fill: shadeColor },
            })),
            { prefix: `&.x-icon-bg-` },
          ),
        }),
        helpers,
      ),
      { prefix: `&.x-icon-` },
    ),
  }
}
