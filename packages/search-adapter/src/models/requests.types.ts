import {
  Banner,
  Facet,
  Filter,
  NextQuery,
  PartialResult,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  Suggestion,
  Tagging
} from '@empathy/search-types';
import { EmpathyAdapterConfig } from '../empathy/config/empathy-adapter-config.types';

export interface SearchResponse {
  banners: Banner[];
  facets: Facet[];
  promoteds: Promoted[];
  queryTagging: Tagging;
  redirections: Redirection[];
  partialResults: PartialResult[];
  results: Result[];
  spellcheck: string;
  totalResults: number;
}

export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}

export interface RecommendationsResponse {
  results: Result[];
}

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

export interface SearchByIdResponse {
  results: Result[];
}

export type EntityNames = keyof (SearchResponse
  & RecommendationsResponse
  & NextQueriesResponse
  & RelatedTagsResponse
  & SuggestionsResponse
  & SearchByIdResponse);

export type FeatureNames = keyof (EmpathyAdapterConfig['features']);

export interface RequestOptions {
  requestId?: string;
}

export interface SearchRequest extends QueryableRequest, FilterableRequest, PageableRequest, TrackableRequest {
  relatedTags?: RelatedTag[];
  sort?: string;
}

export interface RecommendationsRequest extends FilterableRequest, PageableRequest, TrackableRequest {}

export interface SearchByIdRequest extends QueryableRequest, PageableRequest, TrackableRequest {}

export interface SuggestionsRequest extends Partial<QueryableRequest>, PageableRequest {}

export interface RelatedTagsRequest extends QueryableRequest {}

export interface NextQueriesRequest extends QueryableRequest {}

export interface TrackingRequest {
  url: string;
  params: any;
}

// Request utils:
export interface QueryableRequest {
  query: string;
}

export interface FilterableRequest {
  filters?: Record<string, Filter[]>;
}

export interface PageableRequest {
  start?: number;
  rows?: number;
}

export interface TrackableRequest {
  origin: string;
}
