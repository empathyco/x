import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionFilled(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    filled: Object.assign({
      backgroundColor: theme('colors.neutral.10'),

      minHeight: theme('spacing.32'),
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8'),

      '&:hover': {
        backgroundColor: 'var(--suggestion-color-25)'
      },

      '&.suggestion-lg': {
        minHeight: theme('spacing.48'),
        paddingInlineStart: theme('spacing.12'),
        paddingInlineEnd: theme('spacing.12')
      }
    })
  };
}
