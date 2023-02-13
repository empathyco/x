import { map, rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `color` variants for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      '--suggestion-group-color-75': color['75'],
      color: 'var(--suggestion-group-color-75)',
      ...rename(
        map(color, (shadeName, shadeColor) => ({
          color: shadeColor
        })),
        { prefix: '&-' }
      )
    }),
    helpers
  );
}
