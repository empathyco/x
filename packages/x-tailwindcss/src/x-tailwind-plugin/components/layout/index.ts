import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';

import { container } from './container';
import { minMargin } from './min-margin';
import { item } from './item';
import { maxWidth } from './max-width';
import { utils } from './utils';

/**
 * Returns the component `layout` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function layout(helpers: TailwindHelpers) {
  return {
    '.x-layout': rename(
      {
        ...container(helpers),
        ...maxWidth(helpers),
        ...minMargin(helpers),
        ...item(helpers)
      },
      { prefix: '&-' }
    ),
    ...utils(helpers)
  };
}
