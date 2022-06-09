import {
  beaconHttpClient,
  endpointAdapterFactory,
  EndpointAdapterOptions,
  buildUrl
} from '@empathyco/x-adapter-next';
import { TaggingRequest } from '../types/request.types';
import { taggingRequestMapper } from '../mappers/requests/tagging-request.mapper';

export const taggingEndpointAdapterOptions: EndpointAdapterOptions<TaggingRequest, void> = {
  endpoint: ({ url, params }) => buildUrl(url, params),
  httpClient: beaconHttpClient,
  requestMapper: taggingRequestMapper
};

export const taggingEndpointAdapter = endpointAdapterFactory(taggingEndpointAdapterOptions);
