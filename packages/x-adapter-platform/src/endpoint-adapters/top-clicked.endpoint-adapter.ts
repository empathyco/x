import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { BaseRequest, TopClickedResponse } from '../types';
import { topClickedResponseMapper } from '../mappers/response/top-clicked-response.mapper';
import { baseRequestMapper } from '../mappers/request/base-request.mapper';

export const topClickedEndpointAdapterOptions: EndpointAdapterOptions<
  BaseRequest,
  TopClickedResponse
> = {
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/topclicked',
  responseMapper: topClickedResponseMapper,
  requestMapper: baseRequestMapper
};

export const topClickedEndpointAdapter = endpointAdapterFactory(topClickedEndpointAdapterOptions);
