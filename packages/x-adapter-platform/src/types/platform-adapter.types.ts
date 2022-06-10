import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import {
  PopularSearchesRequest,
  PopularSearchesResponse,
  QuerySuggestionsRequest,
  QuerySuggestionsResponse
} from '@empathyco/x-types';
import {
  NextQueriesResponse,
  RelatedTagsResponse,
  SearchResponse,
  SkuSearchResponse,
  TopClickedResponse
} from './response.types';
import { BaseRequest, SearchRequest, TaggingRequest } from './request.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  topClicked: EndpointAdapter<BaseRequest, TopClickedResponse>;
  nextQueries: EndpointAdapter<BaseRequest, NextQueriesResponse>;
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedTags: EndpointAdapter<BaseRequest, RelatedTagsResponse>;
  skuSearch: EndpointAdapter<BaseRequest, SkuSearchResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
