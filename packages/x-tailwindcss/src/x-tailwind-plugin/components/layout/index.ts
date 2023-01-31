import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';

import { container } from './container';
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
    '.layout': rename(
      {
        ...container(),
        ...sizes(helpers),
        ...minMargin(helpers),
        ...item()
      },
      { prefix: '&-' }
    )
  };
}
