import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { SearchResponse } from '../types/response.types';
import { SearchRequest } from '../types/request.types';
import { searchResponseMapper } from '../mappers/response/search-response.mapper';
import { searchRequestMapper } from '../mappers/request/search-request.mapper';

const adapterOptions: EndpointAdapterOptions<SearchRequest, SearchResponse> = {
  endpoint: 'https://api.{env}.empathy.co/search/v1/query/empathy/search',
  responseMapper: searchResponseMapper,
  requestMapper: searchRequestMapper
};

export const searchEndpointAdapter = endpointAdapterFactory<SearchRequest, SearchResponse>(
  adapterOptions
);
