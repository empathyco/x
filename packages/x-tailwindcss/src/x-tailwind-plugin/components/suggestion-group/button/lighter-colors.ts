import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { mapColors } from '../../../utils/map-colors';
/**
 * Returns the `color` variants for component `suggestion group button lighter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupLighterColors(helpers: TailwindHelpers) {
  return rename(
    mapColors(
      color => ({
        '--suggestion-group-button-color-50': color['50'],
        '.suggestion-group-button-lighter:hover': {
          color: 'var(--suggestion-group-button-color-50)'
        }
      }),
      helpers
    ),
    { prefix: '.suggestion-group-' }
  );
}
