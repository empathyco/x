import type { PlatformFacet, PlatformResult } from '../models/index'

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
