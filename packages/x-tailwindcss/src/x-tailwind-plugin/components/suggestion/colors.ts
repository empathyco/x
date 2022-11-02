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
      '--suggestion-color-25': color['25'],
      '--suggestion-color-50': color['50'],
      '--suggestion-color-75': color['75'],
      borderColor: 'transparent',
      color: 'var(--suggestion-color-75)'
    }),
    helpers
  );
}
