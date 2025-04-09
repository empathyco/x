import type { Banner } from '../banner.model';
import type { Facet } from '../facet/facet.model';
import type { PartialResult } from '../partial-result.model';
import type { Promoted } from '../promoted.model';
import type { Redirection } from '../redirection.model';
import type { TaggingRequest } from '../request/tagging-request.model';
import type { Result } from '../result/result.model';
import type { Stats } from '../stats.model';

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
  displayTagging?: TaggingRequest;
  redirections?: Redirection[];
  results: Result[];
  spellcheck?: string;
  stats?: Stats;
  totalResults: number;
}
