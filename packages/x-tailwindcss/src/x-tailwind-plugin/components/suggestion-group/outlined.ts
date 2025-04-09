import type { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    outlined: {
      backgroundColor: theme('x.colors.neutral.0'),
      borderWidth: theme('x.borderWidth.1'),
      borderColor: `var(--suggestion-group-color-75, ${theme('x.colors.neutral.90')})`,
      gap: theme('x.spacing.4'),
      '&:hover': {
        backgroundColor: theme('x.colors.neutral.10'),
        textDecoration: 'none'
      },
      '> *:first-child:not(.suggestion-group-button)': {
        marginInlineStart: theme('x.spacing.8')
      },
      '> *:last-child:not(.suggestion-group-button)': {
        marginInlineEnd: theme('x.spacing.8')
      },
      '&.suggestion-group-lg > *:first-child:not(.suggestion-group-button)': {
        marginInlineStart: theme('x.spacing.12')
      },
      '&.suggestion-group-lg > *:last-child:not(.suggestion-group-button)': {
        marginInlineEnd: theme('x.spacing.12')
      }
    }
  };
}
