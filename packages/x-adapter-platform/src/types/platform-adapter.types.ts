import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import { NextQueriesRequest } from '@empathyco/x-types';
import {
  EmpathizeResponse,
  NextQueriesResponse,
  RelatedTagsResponse,
  SearchResponse,
  SkuSearchResponse,
  TopClickedResponse
} from './response.types';
import { BaseRequest, SearchRequest, TaggingRequest } from './request.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  empathize: EndpointAdapter<BaseRequest, EmpathizeResponse>;
  topClicked: EndpointAdapter<BaseRequest, TopClickedResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  relatedTags: EndpointAdapter<BaseRequest, RelatedTagsResponse>;
  skuSearch: EndpointAdapter<BaseRequest, SkuSearchResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
