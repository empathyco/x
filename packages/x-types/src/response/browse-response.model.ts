import type { Facet } from '../facet/facet.model'
import type { TaggingRequest } from '../request/tagging-request.model'
import type { Result } from '../result/result.model'

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
}
