import { TailwindHelpers } from '../../../../types';

/**
 * Util to add background on hover for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
export function backgroundOnHover(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '&:hover': {
      borderColor: theme('colors.neutral.10'),
      backgroundColor: theme('colors.neutral.10')
    }
  };
}
