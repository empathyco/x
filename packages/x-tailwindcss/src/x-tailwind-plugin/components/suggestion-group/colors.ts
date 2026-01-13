import type { TailwindHelpers } from '../../../types'
import { mapColorsFlat } from '../../utils/map-colors'

/**
 * Returns the `color` variants for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupColors(helpers: TailwindHelpers) {
  return mapColorsFlat((color, colorName) => {
    return {
      [`${colorName}`]: {
        '--suggestion-group-color-75': color['75'],
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
