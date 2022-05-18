import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import {
  IdentifierResultsRequest,
  IdentifierResultsResponse,
  NextQueriesRequest,
  NextQueriesResponse,
  PopularSearchesRequest,
  PopularSearchesResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  SearchRequest,
  SearchResponse,
  TaggingRequest
} from '@empathyco/x-types';

export interface PlatformAdapter extends Adapter {
  empathize: EndpointAdapter<BaseRequest, EmpathizeResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  relatedTags: EndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>;
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
