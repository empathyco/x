import type { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `color` variants for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function inputColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      '--input-color-25': color['25'],
      '--input-color-50': color['50'],
      '--input-color-75': color['75'],
      borderColor: 'var(--input-color-50)',

      '&:focus': {
        borderColor: 'var(--input-color-75)'
      }
    }),
    helpers
  );
}
