import { Facet } from '@empathy/search-types';

/**
 * Configuration options for the {@link FacetsXModule}.
 *
 * @public
 */
export interface FacetsConfig {
  multiSelect: Record<Facet['id'], boolean>;
}
