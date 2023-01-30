import { rename } from '@empathyco/x-utils';
import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';

import { layoutDefault } from './default';
import { sizes } from './sizes';
import { minMargin } from './min-margin';
import { item } from './item';

/**
 * Returns the component `layout` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function layout(helpers: TailwindHelpers) {
  return {
    '.layout-container': deepMerge(
      layoutDefault(),

      rename(
        {
          ...sizes(helpers),
          ...minMargin(helpers)
        },
        { prefix: '&-' }
      )
    ),
    '.layout-item': item()
  };
}
