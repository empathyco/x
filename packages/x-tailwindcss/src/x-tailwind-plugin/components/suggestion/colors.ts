import { map, rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../utils/map-colors';

/**
 * Returns the `color` variants for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionColors(helpers: TailwindHelpers) {
  return mapColors(
    color => ({
      color: color['75'],
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
