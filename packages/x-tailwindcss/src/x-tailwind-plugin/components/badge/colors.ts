import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `colors` variants for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      backgroundColor: color['75']
    }),
    helpers
  );
}
