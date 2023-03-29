import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `colors` variants for component `filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function filterColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      '--filter-color-50': color['50'],
      '--filter-color-75': color['75']
    }),
    helpers
  );
}
