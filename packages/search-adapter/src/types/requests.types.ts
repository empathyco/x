import { Filter, RelatedTag, Sort } from '@empathy/search-types';
import { Dictionary } from './utils.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface QueryableRequest {
  query: string;
  relatedTags?: RelatedTag[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface FilterableRequest {
  filters?: Dictionary<Filter[]>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface PageableRequest {
  rows?: number;
  start?: number;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface TrackableRequest {
  origin: string;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface UserContextRequest {
  user: string;
  session: string;
  userType: string;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface RequestOptions {
  requestId?: string;
  headers?: Dictionary<string>;
  ttlInMinutes?: number;
  [key: string]: any;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SearchRequest extends QueryableRequest, FilterableRequest, PageableRequest, TrackableRequest {
  sort?: Sort;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface TopRecommendationsRequest extends Partial<QueryableRequest>, PageableRequest, TrackableRequest {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SectionRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section: string;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface QueriesRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section?: string;
  queries: string[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ClicksRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section?: string;
  productIds: string[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface UserRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section?: string;
}

/**
 * Request parameters for the searchById(result identifier) endpoint.
 *
 * @public
 */
export interface SearchByIdRequest extends QueryableRequest, PageableRequest, TrackableRequest {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SuggestionsRequest extends Partial<QueryableRequest>, PageableRequest {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface RelatedTagsRequest extends QueryableRequest {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface NextQueriesRequest extends QueryableRequest {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface TrackingRequest {
  params: Dictionary<any>;
  url: string;
}
