import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { productImageDefault } from './default';
import { overlay } from './overlay';
import { zoom } from './zoom';

/**
 * Returns the component `product-image` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function productImage(helpers: TailwindHelpers) {
  return {
    '.product-image': {
      ...productImageDefault(helpers),
      ...rename(
        {
          ...zoom(),
          ...overlay(helpers)
        },
        {
          prefix: '&-'
        }
      )
    }
  };
}
