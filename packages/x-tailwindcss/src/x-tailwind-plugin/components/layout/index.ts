import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';

import { container } from './container';
import { sizes } from './sizes';
import { minMargin } from './min-margin';
import { item } from './item';
import { itemUtils } from './item-utils';

/**
 * Returns the component `layout` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function layout(helpers: TailwindHelpers) {
  return {
    '.layout': rename(
      {
        ...container(helpers),
        ...sizes(helpers),
        ...minMargin(helpers),
        ...item(helpers)
      },
      { prefix: '&-' }
    ),
    ...itemUtils(helpers)
  };
}
