import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionOutlined({ theme }: TailwindHelpers) {
  return {
    outlined: Object.assign({
      borderColor: 'var(--suggestion-color-75)',
      borderWidth: theme('borderWidth.1'),

      minHeight: theme('spacing.32'),
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8'),

      '&:hover': {
        borderColor: 'var(--suggestion-color-50)'
      },

      '&.suggestion-lg': {
        minHeight: theme('spacing.48'),
        paddingInlineStart: theme('spacing.12'),
        paddingInlineEnd: theme('spacing.12')
      }
    })
  };
}
