import type { PlatformFacet } from '../models/facet.model'

/**
 * Response for the `facets` endpoint.
 *
 * @public
 */
export interface PlatformFacetsResponse {
  catalog: {
    facets: PlatformFacet[]
  }
}
