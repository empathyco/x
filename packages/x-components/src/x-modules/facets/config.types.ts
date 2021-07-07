import { Facet } from '@empathyco/x-types';

/**
 * Configuration options for the {@link FacetsXModule}.
 *
 * @public
 */
export interface FacetsConfig {
  /** Dictionary containing the facets indexed by its id, and a boolean value indicating whether
   * their filters support multi selection or not. */
  multiSelect: Record<Facet['id'], boolean>;
}
