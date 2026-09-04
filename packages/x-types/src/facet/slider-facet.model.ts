import type { Facet } from './facet.model'
import type { SliderFilter } from './filter/slider-filter.model'

/**
 * Number Range Facet is a trait for filtering results. It extends from {@link Facet}, changes the
 * modelName and uses {@link SliderFilter} as filters.
 *
 * @public
 */
export interface SliderFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'SliderFacet'
  /** Filters available for the facet. */
  filters: SliderFilter[]
}

/**
 * Type guard to check if a facet is an {@link SliderFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link SliderFacet}, false otherwise.
 *
 * @public
 */
export function isSliderFacet(facet: Facet): facet is SliderFacet {
  return facet.modelName === 'SliderFacet'
}
