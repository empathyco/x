import { TailwindHelpers } from '../../../../types';

/**
 * Util to add background on hover for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function backgroundOnHover(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '&:hover': {
      borderColor: theme('colors.neutral.10'),
      backgroundColor: theme('colors.neutral.10')
    }
  };
}
