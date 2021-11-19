import {
  Banner,
  Facet,
  NextQuery,
  PartialResult,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  Suggestion,
  TaggingInfo
} from '@empathyco/x-types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SearchByIdResponse {
  results: Result[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface TrackableShowResponse {
  showTagging: TaggingInfo;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SearchResponse {
  banners: Banner[];
  facets?: Facet[];
  partialResults: PartialResult[];
  promoteds: Promoted[];
  queryTagging: TaggingInfo;
  redirections: Redirection[];
  results: Result[];
  spellcheck: string;
  totalResults: number;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface TopRecommendationsResponse {
  results: Result[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SectionRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ClicksRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
  totalResults: number;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface QueriesRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
  totalResults: number;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface UserRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
  totalResults: number;
}
