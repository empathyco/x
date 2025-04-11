import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `sizes` variants for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeSizes(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    sm: {
      '--attach-horizontal-offset': theme('x.spacing.8'),

      height: theme('x.spacing.20'),
      paddingInlineStart: theme('x.spacing.8'),
      paddingInlineEnd: theme('x.spacing.8'),
    },
    md: {
      '--attach-horizontal-offset': theme('x.spacing.12'),

      height: theme('x.spacing.24'),
      paddingInlineStart: theme('x.spacing.12'),
      paddingInlineEnd: theme('x.spacing.12'),
    },
  }
}
