import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../../utils/map-colors';

/**
 * Returns the `color` variants for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonColors(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return mapColors(
    color => ({
      borderColor: color['50'],
      backgroundColor: color['50'],
      color: theme('colors.neutral.0'),

      '&:hover': {
        backgroundColor: color['75'],
        borderColor: color['75'],
        color: theme('colors.neutral.0')
      },

      '&:active': {
        borderColor: color['75'],
        backgroundColor: color['75'],
        color: theme('colors.neutral.0')
      },

      '&:disabled': {
        borderColor: theme('colors.neutral.10'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.25')
      }
    }),
    helpers
  );
}
