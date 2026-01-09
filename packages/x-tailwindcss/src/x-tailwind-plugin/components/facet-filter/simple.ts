import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `simple` variant for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function facetFilterSimple(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    simple: {
      '&:hover': {
        color: theme('x.colors.neutral.90'),
        opacity: '.6',
      },
      '&.selected': {
        fontWeight: theme('x.fontWeight.regular'),
        letterSpacing: theme('x.letterSpacing.md'),

        '&:hover': {
          color: `var(--filter-color-50, ${theme('x.colors.neutral.50')})`,
        },

        '&:disabled': {
          color: theme('x.colors.neutral.25'),
        },
      },
      '&:disabled': {
        color: theme('x.colors.neutral.25'),
        opacity: '1',
      },
    },
  }
}
