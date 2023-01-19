import { TailwindHelpers } from '../../../types';

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
      backgroundColor: theme('colors.neutral.0'),
      borderWidth: theme('borderWidth.1'),
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      borderColor: `var(--suggestion-group-color-75, ${theme('colors.neutral.90')})`,
      gap: theme('spacing.4'),
      '&:hover': {
        backgroundColor: theme('colors.neutral.10'),
        '.suggestion': {
          textDecoration: 'none'
        }
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
