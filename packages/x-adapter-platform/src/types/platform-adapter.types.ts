import { Adapter, EndpointAdapter } from '@empathyco/x-adapter';
import {
  IdentifierResultsRequest,
  IdentifierResultsResponse,
  PopularSearchesRequest,
  PopularSearchesResponse,
  QuerySuggestionsRequest,
  NextQueriesRequest,
  NextQueriesResponse,
  QuerySuggestionsResponse,
  RecommendationsRequest,
  RecommendationsResponse,
  TaggingRequest,
  RelatedTagsResponse,
  RelatedTagsRequest,
  SearchRequest,
  SearchResponse
} from '@empathyco/x-types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  recommendations: EndpointAdapter<RecommendationsRequest, RecommendationsResponse>;
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedTags: EndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
