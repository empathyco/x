import type { FilterModelName } from '../../named-model.model'
import type { Facet } from '../facet.model'
import type { Filter } from './filter.model'

/**
 * A filter which is associated with a {@link Facet}.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
export interface FacetFilter extends Filter {
  /**
   * The filter {@link ModelNameType | model name} excluding {@link RawFilter | RawFilter}
   * model name.
   */
  modelName: Exclude<FilterModelName, 'RawFilter'>
  /** An unique ID that identifies the facet that uses this filter. */
  facetId: Facet['id']
}

/**
 * Type guard to check if a filter is a {@link FacetFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns  True if the filter is a {@link FacetFilter}, false otherwise.
 *
 * @public
 */
export function isFacetFilter(filter: Filter): filter is FacetFilter {
  return 'facetId' in filter
}
