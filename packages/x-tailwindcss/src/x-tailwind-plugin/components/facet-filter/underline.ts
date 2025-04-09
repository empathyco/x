import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `underline` variant for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function facetFilterUnderline(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    underline: {
      '&:hover': {
        borderColor: 'currentColor',

        '&:disabled': {
          borderColor: 'transparent',
        },
      },
      '&.selected': {
        fontWeight: theme('x.fontWeight.regular'),
        letterSpacing: theme('x.letterSpacing.md'),
      },
    },
  }
}
