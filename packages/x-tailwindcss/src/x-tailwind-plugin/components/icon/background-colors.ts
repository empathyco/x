import type { TailwindHelpers } from '../../../types'
import { mapColorsFlat } from '../../utils/map-colors'

/**
 * Returns the `background color` variants for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function iconBackgroundColors(helpers: TailwindHelpers) {
  return mapColorsFlat((color, colorName) => {
    return {
      [`bg-${colorName}`]: {
        '[stroke="#fff"]': { stroke: color['50'] },
        '[fill="#fff"]': { fill: color['50'] },
      },

      ...Object.fromEntries(
        Object.entries(color).map(([shadeName, shadeColor]) => [
          `bg-${colorName}-${shadeName}`,
          {
            '[stroke="#fff"]': { stroke: shadeColor },
            '[fill="#fff"]': { fill: shadeColor },
          },
        ]),
      ),
    }
  }, helpers)
}
