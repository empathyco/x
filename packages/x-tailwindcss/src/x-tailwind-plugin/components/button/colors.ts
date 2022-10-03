import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

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
      '--button-color-25': color['25'],
      '--button-color-50': color['50'],
      '--button-color-75': color['75'],
      borderColor: 'var(--button-color-50)',
      backgroundColor: 'var(--button-color-50)',
      color: theme('colors.neutral.0'),

      '&:hover': {
        backgroundColor: 'var(--button-color-75)',
        borderColor: 'var(--button-color-75)',
        color: theme('colors.neutral.0')
      },

      '&:active': {
        borderColor: 'var(--button-color-75)',
        backgroundColor: 'var(--button-color-75)',
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
