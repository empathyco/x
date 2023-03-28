import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { filterDefault } from './default';
import { filterSizes } from './sizes';

/**
 * Returns the component `filter` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function filter(helpers: TailwindHelpers) {
  return {
    '.filter': {
      ...filterDefault(helpers),
      ...rename(
        {
          ...filterSizes(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
