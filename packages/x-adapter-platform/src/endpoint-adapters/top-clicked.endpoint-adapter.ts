import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { BaseRequest } from '../types/request.types';
import { TopClickedResponse } from '../types/response.types';
import { topClickedResponseMapper } from '../mappers/responses/top-clicked-response.mapper';
import { baseRequestMapper } from '../mappers/requests/base-request.mapper';

export const topClickedEndpointAdapterOptions: EndpointAdapterOptions<
  BaseRequest,
  TopClickedResponse
> = {
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/topclicked',
  responseMapper: topClickedResponseMapper,
  requestMapper: baseRequestMapper
};

export const topClickedEndpointAdapter = endpointAdapterFactory(topClickedEndpointAdapterOptions);
