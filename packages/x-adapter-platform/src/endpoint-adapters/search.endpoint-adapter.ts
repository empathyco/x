import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { PlatformSearchResponse } from '../types/response.types';
import { PlatformSearchRequest } from '../types/request.types';

const adapterOptions: EndpointAdapterOptions<PlatformSearchRequest, PlatformSearchResponse> = {
  endpoint: 'https://api.{env}.empathy.co/search/v1/query/empathy/search'
};

export const searchEndpointAdapter = endpointAdapterFactory<
  PlatformSearchRequest,
  PlatformSearchResponse
>(adapterOptions);
