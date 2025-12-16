import type { TailwindHelpers } from '../../../types'
import { mapColorsFlat } from '../../utils/map-colors'

/**
 * Returns the `color` variants for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionColors(helpers: TailwindHelpers) {
  return mapColorsFlat((color, colorName) => {
    return {
      [`${colorName}`]: {
        color: color['75'],
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
