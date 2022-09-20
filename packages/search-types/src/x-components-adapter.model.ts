import { EndpointAdapter } from '@empathyco/x-adapter';
import {
  IdentifierResultsRequest,
  NextQueriesRequest,
  PopularSearchesRequest,
  QuerySuggestionsRequest,
  RecommendationsRequest,
  RelatedTagsRequest,
  SearchRequest,
  TaggingRequest
} from './request';
import {
  IdentifierResultsResponse,
  NextQueriesResponse,
  PopularSearchesResponse,
  QuerySuggestionsResponse,
  RecommendationsResponse,
  RelatedTagsResponse,
  SearchResponse
} from './response';

export interface XComponentsAdapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  recommendations: EndpointAdapter<RecommendationsRequest, RecommendationsResponse>;
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedTags: EndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
