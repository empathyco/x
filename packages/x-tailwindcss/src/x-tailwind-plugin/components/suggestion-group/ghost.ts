import { TailwindHelpers } from '../../../types';

/**
 * Returns the `ghost` variant for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ghost: {
      backgroundColor: 'transparent',
      gap: theme('spacing.4'),
      '&:hover': {
        backgroundColor: theme('colors.neutral.10'),
        textDecoration: 'none'
      },
      '> *:first-child:not(.suggestion-group-button)': {
        marginInlineStart: theme('spacing.8')
      },
      '> *:last-child:not(.suggestion-group-button)': {
        marginInlineEnd: theme('spacing.8')
      },
      '&.suggestion-group-lg > *:first-child:not(.suggestion-group-button)': {
        marginInlineStart: theme('spacing.12')
      },
      '&.suggestion-group-lg > *:last-child:not(.suggestion-group-button)': {
        marginInlineEnd: theme('spacing.12')
      }
    }
  };
}
