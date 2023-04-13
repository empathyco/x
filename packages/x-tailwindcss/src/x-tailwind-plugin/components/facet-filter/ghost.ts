import { TailwindHelpers } from '../../../types';

/**
 * Returns the `ghost` variant for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function facetFilterGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;

  const sizes = {
    sm: { paddingInline: theme('spacing.4') },
    md: { paddingInline: theme('spacing.8') },
    lg: { paddingInline: theme('spacing.12') }
  };

  return {
    ghost: {
      ...sizes.md,
      ...sizes,

      '&:hover': {
        backgroundColor: theme('colors.neutral.10')
      },
      '&.selected': {
        fontWeight: theme('fontWeight.regular'),
        color: `var(--filter-color-75)`,
        letterSpacing: theme('letterSpacing.md')
      },
      '&:disabled': {
        backgroundColor: 'unset',
        color: theme('colors.neutral.25')
      }
    }
  };
}
