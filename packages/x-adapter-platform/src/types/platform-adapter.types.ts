import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
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
  TaggingRequest
} from '@empathyco/x-types';
import { BaseRequest, SearchRequest } from './request.types';
import { RelatedTagsResponse, SearchResponse } from './response.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  recommendations: EndpointAdapter<RecommendationsRequest, RecommendationsResponse>;
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedTags: EndpointAdapter<BaseRequest, RelatedTagsResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
