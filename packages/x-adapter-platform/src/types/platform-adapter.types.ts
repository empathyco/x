import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import {
  IdentifierResultsRequest,
  IdentifierResultsResponse,
  PopularSearchesRequest,
  PopularSearchesResponse,
  QuerySuggestionsRequest,
  QuerySuggestionsResponse,
  NextQueriesRequest,
  TaggingRequest,
  SearchRequest,
  SearchResponse
} from '@empathyco/x-types';
import { BaseRequest } from './request.types';
import { NextQueriesResponse, RelatedTagsResponse, TopClickedResponse } from './response.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  topClicked: EndpointAdapter<BaseRequest, TopClickedResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedTags: EndpointAdapter<BaseRequest, RelatedTagsResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
