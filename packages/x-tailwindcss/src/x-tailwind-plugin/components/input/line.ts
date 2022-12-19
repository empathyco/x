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
      borderBottomWidth: theme('borderWidth.1'),

      '&:hover': {
        borderBottomWidth: theme('borderWidth.2')
      },

      '&:focus': {
        borderColor: theme('colors.neutral.90'),
        color: theme('colors.neutral.90'),
        borderBottomWidth: theme('borderWidth.2')
      },

      '&:disabled': {
        backgroundColor: theme('colors.neutral.10'),
        borderColor: theme('colors.neutral.25')
      }
    }
  };
}
