import { deepMerge } from '@empathyco/x-deep-merge';
import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { facetFilterColors } from './colors';
import { facetFilterDefault } from './default';
import { facetFilterGhost } from './ghost';
import { facetFilterSizes } from './sizes';
import { facetFilterUnderline } from './underline';

/**
 * Returns the component `facet-filter` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function facetFilter(helpers: TailwindHelpers) {
  return {
    '.facet-filter': deepMerge(
      facetFilterDefault(helpers),
      rename(
        {
          ...facetFilterSizes(helpers),
          ...facetFilterColors(helpers),
          ...facetFilterUnderline(helpers),
          ...facetFilterGhost(helpers)
        },
        { prefix: '&-' }
      )
    )
  };
}
