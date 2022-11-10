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
    tag: Object.assign({
      minHeight: theme('spacing.32'),
      paddingTop: 0,
      paddingBottom: 0,
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8'),

      backgroundColor: theme('colors.neutral.0'),
      borderWidth: theme('borderWidth.1'),
      borderColor: theme('colors.neutral.90'),

      '&:hover': {
        backgroundColor: theme('colors.neutral.10')
      },

      '&.suggestion-tag': {
        borderColor: 'var(--suggestion-color-75)'
      },

      '&.suggestion-md': {
        minHeight: theme('spacing.32'),
        paddingInlineStart: theme('spacing.8'),
        paddingInlineEnd: theme('spacing.8')
      },

      '&.suggestion-lg': {
        minHeight: theme('spacing.48'),
        paddingInlineStart: theme('spacing.12'),
        paddingInlineEnd: theme('spacing.12')
      }
    })
  };
}
