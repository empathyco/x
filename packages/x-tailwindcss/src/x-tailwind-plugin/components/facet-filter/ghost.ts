import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `ghost` variant for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function facetFilterGhost(helpers: TailwindHelpers) {
  const { theme } = helpers

  const sizes = {
    sm: { paddingInline: theme('x.spacing.4') },
    md: { paddingInline: theme('x.spacing.8') },
    lg: { paddingInline: theme('x.spacing.12') },
  }

  return {
    ghost: {
      ...sizes.md,
      ...sizes,

      '&:hover': {
        backgroundColor: theme('x.colors.neutral.10'),
        color: theme('x.colors.neutral.90'),
      },
      '&.selected': {
        fontWeight: theme('x.fontWeight.regular'),
        color: `var(--filter-color-75)`,
        letterSpacing: theme('x.letterSpacing.md'),
      },
      '&:disabled': {
        backgroundColor: 'unset',
        color: theme('x.colors.neutral.25'),
      },
    },
  }
}
