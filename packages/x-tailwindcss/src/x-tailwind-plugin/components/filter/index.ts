import { deepMerge } from '@empathyco/x-deep-merge';
import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { filterColors } from './colors';
import { filterDefault } from './default';
import { filterGhost } from './ghost';
import { filterSizes } from './sizes';
import { filterUnderline } from './underline';

/**
 * Returns the component `filter` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function filter(helpers: TailwindHelpers) {
  return {
    '.filter': deepMerge(
      filterDefault(helpers),
      rename(
        {
          ...filterSizes(helpers),
          ...filterColors(helpers),
          ...filterUnderline(helpers),
          ...filterGhost(helpers)
        },
        { prefix: '&-' }
      )
    )
  };
}
