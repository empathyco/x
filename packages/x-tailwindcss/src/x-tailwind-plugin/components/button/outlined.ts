import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    outlined: Object.assign({
      borderColor: 'var(--button-color-50)',
      backgroundColor: theme('colors.neutral.0'),
      color: 'var(--button-color-50)',

      '&:hover': {
        borderColor: 'var(--button-color-50)',
        backgroundColor: 'var(--button-color-50)',
        color: theme('colors.neutral.0')
      },

      '&:active': {
        borderColor: 'var(--button-color-50)',
        backgroundColor: 'var(--button-color-50)',
        color: theme('colors.neutral.0')
      },

      '&:disabled': {
        borderColor: theme('colors.neutral.25'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.25')
      }
    })
  };
}
