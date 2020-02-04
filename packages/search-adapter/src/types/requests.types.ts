import { Filter, RelatedTag } from '@empathy/search-types';
import { Dictionary } from './utils.types';

export interface SearchRequest extends QueryableRequest, FilterableRequest, PageableRequest, TrackableRequest {
  sort?: string;
}

export interface TopRecommendationsRequest extends Partial<QueryableRequest>, PageableRequest, TrackableRequest {}

export interface SectionRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section: string;
}

export interface QueriesRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section?: string;
  queries: string[];
}

export interface ClicksRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section?: string;
  productIds: string[];
}

export interface UserRecommendationsRequest extends TrackableRequest, PageableRequest, UserContextRequest {
  section?: string;
}

export interface SearchByIdRequest extends QueryableRequest, PageableRequest, TrackableRequest {}

export interface SuggestionsRequest extends Partial<QueryableRequest>, PageableRequest {}

export interface RelatedTagsRequest extends QueryableRequest {}

export interface NextQueriesRequest extends QueryableRequest {}

export interface TrackingRequest {
  params: Dictionary<any>;
  url: string;
}

// Request utils:
export interface QueryableRequest {
  query: string;
  relatedTags?: RelatedTag[];
}

export interface FilterableRequest {
  filters?: Dictionary<Filter[]>;
}

export interface PageableRequest {
  rows?: number;
  start?: number;
}

export interface TrackableRequest {
  origin: string;
}

export interface UserContextRequest {
  user: string;
  session: string;
  userType: string;
}

export interface RequestOptions {
  requestId?: string;
  ttlInMinutes?: number;
  [key: string]: any;
}
