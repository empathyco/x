import type { Banner } from '../banner.model'
import type { Facet } from '../facet/facet.model'
import type { Promoted } from '../promoted.model'
import type { TaggingRequest } from '../request/tagging-request.model'
import type { Result } from '../result/result.model'
import type { Stats } from '../stats.model'

/**
 * Response for the browse endpoint.
 *
 * @public
 */
export interface BrowseResponse {
  facets?: Facet[]
  browseTagging?: TaggingRequest
  displayBrowseTagging?: TaggingRequest
  results: Result[]
  totalResults: number
  banners?: Banner[]
  promoteds?: Promoted[]
  stats?: Stats
}
