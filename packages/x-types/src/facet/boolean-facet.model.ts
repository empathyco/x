import type { Facet } from './facet.model'
import type { BooleanFilter } from './filter/boolean-filter.model'

/**
 * Boolean facet is a trait for filtering results. It extends from {@link Facet} changes the
 * modelName and uses {@link BooleanFilter} as filter.
 *
 * @public
 */
export interface BooleanFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'BooleanFacet'
  /** Filters available for the facet. */
  filters: BooleanFilter[]
}

/**
 * Type guard to check if a facet is an {@link BooleanFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link BooleanFacet}, false otherwise.
 *
 * @public
 */
export function isBooleanFacet(facet: Facet): facet is BooleanFacet {
  return facet.modelName === 'BooleanFacet'
}
