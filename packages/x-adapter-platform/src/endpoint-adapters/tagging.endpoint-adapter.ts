import {
  beaconHttpClient,
  endpointAdapterFactory,
  EndpointAdapterOptions,
  buildUrl
} from '@empathyco/x-adapter-next';
import { TaggingRequest } from '../types';
import { taggingRequestMapper } from '../mappers/request/tagging-request.mapper';

export const taggingEndpointAdapterOptions: EndpointAdapterOptions<TaggingRequest, void> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  endpoint: ({ url, params }) => buildUrl(url, params),
  httpClient: beaconHttpClient,
  requestMapper: taggingRequestMapper
};

export const taggingEndpointAdapter = endpointAdapterFactory(taggingEndpointAdapterOptions);
