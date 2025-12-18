import type { CssStyleOptions, TailwindHelpers } from '../../types'
import type pluginTheme from '../theme'
import { reduce } from '@empathyco/x-utils'

/**
 * Type of the colors from Theme.
 */
export type ThemeColors = (typeof pluginTheme)['colors']

/**
 * Type of each Theme color.
 */
export interface ThemeColor {
  0?: string
  10?: string
  25: string
  50: string
  75: string
  90?: string
  100?: string
}

/**
 * This functions takes all the Theme colors and maps them to custom CSS defined by the mapperFn.
 *
 * @example
 * ```
 * mapColors(color=> ({backgroundColor: color['50']}))
 *
 * returns:
 * {
 *   'neutral'{ backgroundColor: '#808080' },
 *   'lead'{ backgroundColor: '#243D48' },
 *   'auxiliary'{ backgroundColor: '#0086B2' },
 *   'accent'{ backgroundColor: '#D44A6F' },
 *   'highlight'{ backgroundColor: '#8B6391' },
 *   'neutral'{ backgroundColor: '#10B981' },
 *   'warning'{ backgroundColor: '#F59E0B' },
 *   'error'{ backgroundColor: '#EF4444' },
 * }
 * ```
 *
 * @param mapperFn - The function to map each Theme color to the final CSS.
 * @param helpers - The {@link TailwindHelpers} used to generate CSS.
 *
 *@returns The {@link CssStyleOptions} with styles for all the colors.
 */
export function mapColors<T extends CssStyleOptions>(
  mapperFn: (color: ThemeColor, colorName: string) => T,
  { theme }: TailwindHelpers,
) {
  const colors: Omit<ThemeColors, 'transparent' | 'current'> = theme('x.colors')
  return reduce(
    colors,
    (mappedColors, colorName, color) => {
      if (!['transparent', 'current'].includes(colorName)) {
        mappedColors[colorName] = {
          ...mapperFn(color, colorName),
        }
      }
      return mappedColors
    },
    {} as {
      -readonly [Key in keyof ThemeColors]: T
    },
  )
}

export function mapColorsFlat<T extends CssStyleOptions>(
  mapperFn: (color: ThemeColor, colorName: string) => Record<string, T>,
  { theme }: TailwindHelpers,
) {
  const colors: Omit<ThemeColors, 'transparent' | 'current'> = theme('x.colors')

  return Object.entries(colors).reduce(
    (acc, [colorName, color]) => {
      if (!['transparent', 'current'].includes(colorName)) {
        Object.assign(acc, mapperFn(color as ThemeColor, colorName))
      }
      return acc
    },
    {} as Record<string, T>,
  )
}
