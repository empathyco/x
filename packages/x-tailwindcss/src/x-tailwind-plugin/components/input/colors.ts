import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `color` variants for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function inputColors(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return mapColors(
    color => ({
      '--input-color-50': color['50'],
      '--input-color-75': color['75'],
      borderColor: 'var(--input-color-50)',
      backgroundColor: theme('colors.neutral.0'),
      color: theme('colors.neutral.50'),

      '&:focus': {
        borderColor: 'var(--input-color-75)',
        color: theme('colors.neutral.90')
      }
    }),
    helpers
  );
}
