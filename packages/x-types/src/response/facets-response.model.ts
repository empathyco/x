import type { Facet } from '../facet/facet.model'

/**
 * Response for the facet endpoint.
 *
 * @public
 */
export interface FacetsResponse {
  facets?: Facet[]
}
