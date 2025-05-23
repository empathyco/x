import type { TailwindHelpers } from '../../../../types'

/**
 * Returns the `sizes` variants for component `title1`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function titleSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('x.fontSize.xl'),
      lineHeight: theme('x.lineHeight.md'),
    },
    md: {
      fontSize: theme('x.fontSize.2xl'),
      lineHeight: theme('x.lineHeight.sm'),
    },
    lg: {
      fontSize: theme('x.fontSize.4xl'),
    },
  }
}
