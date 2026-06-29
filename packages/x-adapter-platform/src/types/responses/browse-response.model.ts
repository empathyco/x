import type { PlatformFacet } from '../models/facet.model'
import type { PlatformBanner, PlatformPromoted } from '../models/index'
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
    stats: {
      price: {
        min: number
        max: number
      }
    }
  }
  banner: {
    content: PlatformBanner[]
  }
  promoted: {
    content: PlatformPromoted[]
  }
}
