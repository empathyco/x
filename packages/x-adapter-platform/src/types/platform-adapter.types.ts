import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import { IdentifierResultsRequest, IdentifierResultsResponse } from '@empathyco/x-types';
import { BaseRequest, SearchRequest, TaggingRequest } from './request.types';
import {
  EmpathizeResponse,
  NextQueriesResponse,
  RelatedTagsResponse,
  SearchResponse,
  TopClickedResponse
} from './response.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  empathize: EndpointAdapter<BaseRequest, EmpathizeResponse>;
  topClicked: EndpointAdapter<BaseRequest, TopClickedResponse>;
  nextQueries: EndpointAdapter<BaseRequest, NextQueriesResponse>;
  relatedTags: EndpointAdapter<BaseRequest, RelatedTagsResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
}
