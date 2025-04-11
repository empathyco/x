import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `sizes` variants for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupSizes(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    sm: {
      minHeight: theme('x.spacing.24'),
      fontSize: theme('x.fontSize.sm'),
    },
    md: {
      minHeight: theme('x.spacing.32'),
      fontSize: theme('x.fontSize.sm'),
    },
    lg: {
      minHeight: theme('x.spacing.48'),
      fontSize: theme('x.fontSize.md'),
      gap: theme('x.spacing.24'),
    },
  }
}
