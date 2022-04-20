import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { SearchResponse } from '../types/response.types';
import { PlatformSearchRequest } from '../types/request.types';
import { searchResponseMapper } from '../mappers/response/search-response.mapper';

const adapterOptions: EndpointAdapterOptions<PlatformSearchRequest, SearchResponse> = {
  endpoint: 'https://api.{env}.empathy.co/search/v1/query/empathy/search',
  responseMapper: searchResponseMapper
};

export const searchEndpointAdapter = endpointAdapterFactory<PlatformSearchRequest, SearchResponse>(
  adapterOptions
);
