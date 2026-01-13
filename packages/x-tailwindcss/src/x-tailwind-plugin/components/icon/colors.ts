import type { TailwindHelpers } from '../../../types'
import { mapColorsFlat } from '../../utils/map-colors'

/**
 * Returns the `color` variants for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function iconColors(helpers: TailwindHelpers) {
  return mapColorsFlat((color, colorName) => {
    return {
      [`${colorName}`]: {
        color: color[50],
      },

      ...Object.fromEntries(
        Object.entries(color).map(([shadeName, shadeColor]) => [
          `${colorName}-${shadeName}`,
          {
            color: shadeColor,
          },
        ]),
      ),
    }
  }, helpers)
}
