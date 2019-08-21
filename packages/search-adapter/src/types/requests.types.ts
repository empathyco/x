import { Filter, RelatedTag } from '@empathy/search-types';
import { Dictionary } from './utils.types';

export interface SearchRequest extends QueryableRequest, FilterableRequest, PageableRequest, TrackableRequest {
  relatedTags?: RelatedTag[];
  sort?: string;
}

export interface RecommendationsRequest extends FilterableRequest, PageableRequest, TrackableRequest, Partial<QueryableRequest> {}

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

export interface RequestOptions {
  requestId?: string;
  ttlInMinutes?: number;
  [key: string]: any;
}
