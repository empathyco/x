import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { fadeSizes } from './sizes';

/**
 * Returns the `fade` variants for the component `sliding panel`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelFade(helpers: TailwindHelpers) {
  const sizes = fadeSizes(helpers);
  return {
    '&.fade': {
      ...sizes.md,
      ...rename(
        {
          ...sizes
        },
        { prefix: '&-' }
      )
    }
  };
}
