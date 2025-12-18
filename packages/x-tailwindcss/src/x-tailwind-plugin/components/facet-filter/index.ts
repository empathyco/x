import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { rename } from '@empathyco/x-utils'
import { facetFilterColors } from './colors'
import { facetFilterDefault } from './default'
import { facetFilterGhost } from './ghost'
import { facetFilterSimple } from './simple'
import { facetFilterSizes } from './sizes'
import { facetFilterUnderline } from './underline'

/**
 * Returns the component `facet-filter` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function facetFilter(helpers: TailwindHelpers) {
  return {
    '.x-facet-filter': deepMerge(facetFilterDefault(helpers)),
    ...rename(
      {
        ...facetFilterSizes(helpers),
        ...facetFilterColors(helpers),
        ...facetFilterUnderline(helpers),
        ...facetFilterGhost(helpers),
        ...facetFilterSimple(helpers),
      },
      { prefix: '.x-facet-filter-' },
    ),
  }
}
