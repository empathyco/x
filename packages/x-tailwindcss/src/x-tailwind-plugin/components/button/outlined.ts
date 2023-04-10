import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    outlined: {
      borderColor: `var(--button-color-50,${theme('colors.neutral.90')})`,
      backgroundColor: theme('colors.neutral.0'),
      color: `var(--button-color-50,${theme('colors.neutral.90')})`,

      '&:hover,&:active': {
        borderColor: `var(--button-color-50,${theme('colors.neutral.90')})`,
        backgroundColor: `var(--button-color-50,${theme('colors.neutral.90')})`,
        color: theme('colors.neutral.0')
      },

      '&:disabled': {
        borderColor: theme('colors.neutral.25'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.25')
      }
    }
  };
}
