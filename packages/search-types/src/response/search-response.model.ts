import { Banner } from '../banner.model';
import { Facet } from '../facet/facet.model';
import { PartialResult } from '../partial-result.model';
import { Promoted } from '../promoted.model';
import { TaggingRequest } from '../request/tagging-request.model';
import { Redirection } from '../redirection.model';
import { Result } from '../result/result.model';

/**
 * Response for the search endpoint.
 *
 * @public
 */
export interface SearchResponse {
  banners?: Banner[];
  facets?: Facet[];
  partialResults?: PartialResult[];
  promoteds?: Promoted[];
  queryTagging?: TaggingRequest;
  redirections?: Redirection[];
  results: Result[];
  spellcheck?: string;
  totalResults: number;
}
