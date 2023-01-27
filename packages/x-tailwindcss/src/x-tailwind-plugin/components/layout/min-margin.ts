import { map, rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';

/**
 * Returns the `min-margin` variants of component `layout`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function minMargin(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    'min-margin': rename(
      map(theme('spacing'), (spacingName, spacingValue) => ({
        '--x-layout-min-margin': spacingValue
      })),
      { prefix: '&-' }
    )
  };
}
