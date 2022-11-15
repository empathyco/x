import { TailwindHelpers } from '../../../types';

/**
 * Returns the `tag` variant for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionTag(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    tag: {
      minHeight: theme('spacing.32'),
      paddingTop: 0,
      paddingBottom: 0,
      alignItems: 'center',
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8'),

      backgroundColor: theme('colors.neutral.0'),
      borderWidth: theme('borderWidth.1'),
      borderColor: 'currentColor',

      '&:hover': {
        backgroundColor: theme('colors.neutral.10'),
        textDecoration: 'none'
      },

      '&.suggestion-md': {
        minHeight: theme('spacing.32'),
        paddingInlineStart: theme('spacing.8'),
        paddingInlineEnd: theme('spacing.8')
      },

      '&.suggestion-lg': {
        minHeight: theme('spacing.48'),
        paddingInlineStart: theme('spacing.12'),
        paddingInlineEnd: theme('spacing.12'),
        gap: theme('spacing.12')
      },

      // Disable Align icon
      '& *': {
        '--enableIconOffset': 'var(--OFF)'
      }
    }
  };
}
