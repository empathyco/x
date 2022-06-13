import { beaconHttpClient, endpointAdapterFactory, buildUrl } from '@empathyco/x-adapter-next';
import { TaggingRequest } from '@empathyco/x-types';
import { taggingRequestMapper } from '../mappers/requests/tagging-request.mapper';

export const taggingEndpointAdapter = endpointAdapterFactory<TaggingRequest, void>({
  endpoint: ({ url, params }) => buildUrl(url, params),
  httpClient: beaconHttpClient,
  requestMapper: taggingRequestMapper
});
