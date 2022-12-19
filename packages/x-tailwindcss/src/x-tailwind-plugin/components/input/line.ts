import { TailwindHelpers } from '../../../types';

/**
 * Returns the `line` variant for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function inputLine(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    line: {
      borderWidth: 0,
      borderBottomWidth: 1,

      '&:hover': {
        borderBottomWidth: 2,
        backgroundColor: 'var(--button-color-50)',
        color: theme('colors.neutral.0')
      },

      '&:focus': {
        borderColor: theme('colors.neutral.90'),
        color: theme('colors.neutral.90'),
        borderBottomWidth: 2
      },

      '&:disabled': {
        borderColor: theme('colors.neutral.25'),
        backgroundColor: theme('colors.neutral.10')
      }
    }
  };
}
