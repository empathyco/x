import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `color` variants for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonColors(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return mapColors(
    color => ({
      '--button-color-25': color['25'],
      '--button-color-50': color['50'],
      '--button-color-75': color['75'],
      borderColor: 'var(--button-color-50)',
      backgroundColor: 'var(--button-color-50)',
      color: theme('colors.neutral.0')
    }),
    helpers
  );
}
