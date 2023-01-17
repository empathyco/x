import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { productImageDefault } from './default';
import { overlay } from './overlay';
import { zoom } from './zoom';

/**
 * Returns the component `input` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function productImage(helpers: TailwindHelpers) {
  return {
    '.product-image': {
      ...productImageDefault(helpers),
      ...rename(
        {
          ...zoom(),
          ...overlay()
        },
        {
          prefix: '&-'
        }
      )
    }
  };
}
