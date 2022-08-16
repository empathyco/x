import { beaconHttpClient, endpointAdapterFactory } from '@empathyco/x-adapter';
import { TaggingRequest } from '@empathyco/x-types';
import { taggingRequestMapper } from '../mappers/requests/tagging-request.mapper';

export const taggingEndpointAdapter = endpointAdapterFactory<TaggingRequest, void>({
  endpoint: ({ url }) => url,
  requestMapper: taggingRequestMapper,
  defaultRequestOptions: {
    id: 'tagging',
    properties: { keepalive: true }
  }
});
