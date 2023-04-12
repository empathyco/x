import { TailwindHelpers } from '../../../types';

/**
 * Returns the `simple` variant for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function facetFilterSimple(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    simple: {
      '&:hover': {
        color: theme('colors.neutral.90'),
        opacity: '.6'
      },
      '&.selected': {
        fontWeight: theme('fontWeight.regular'),
        letterSpacing: theme('letterSpacing.md'),

        '&:hover': {
          color: `var(--filter-color-50, ${theme('colors.neutral.50')})`
        },

        '&:disabled': {
          color: theme('colors.neutral.25')
        }
      },
      '&:disabled': {
        color: theme('colors.neutral.25'),
        opacity: '1'
      }
    }
  };
}
