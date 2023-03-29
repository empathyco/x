import { TailwindHelpers } from '../../../types';

/**
 * Returns the `ghost` variant for component `filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function filterGhost(helpers: TailwindHelpers) {
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
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.90')
      },
      '&.selected': {
        fontWeight: theme('fontWeight.regular'),
        color: `var(--filter-color-75)`
      },
      '&:disabled': {
        backgroundColor: 'unset',
        color: theme('colors.neutral.25')
      }
    }
  };
}
