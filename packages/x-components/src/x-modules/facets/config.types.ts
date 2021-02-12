import { Facet } from '@empathy/search-types';

/**
 * Configuration options for the {@link FacetsXModule}.
 *
 * @public
 */
export interface FacetsConfig {
  /** Dictionary containing the facets indexed by its id, and a boolean value indicating whether
   * their filters support multi selection or not. */
  multiSelect: Record<Facet['id'], boolean>;

  /** If True, the selection state will only be handled by x-components. Its `selected` property
   * can only be modified by toggling a filter. This means that when new facets are stored, their
   * filters `selected` value will be modified to the previous state ones.
   * When False, filters will just be stored without manipulating its `selected` property. */
  ignoreNewFiltersSelected: boolean;
}
