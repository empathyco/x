import type { PlatformFacet } from '../models/facet.model'
import type { PlatformResult } from '../models/result.model'

/**
 * Response for the `browse` endpoint.
 *
 * @public
 */
export interface PlatformBrowseResponse {
  catalog: {
    content: PlatformResult[]
    facets: PlatformFacet[]
    numFound: number
    tagging: {
      browseCategory: string
      displayBrowseCategory: string
    }
  }
}
