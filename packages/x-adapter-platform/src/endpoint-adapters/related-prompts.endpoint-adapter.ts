import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types';
import { relatedPromptsRequestMapper } from '../mappers/requests/related-prompts-request.mapper';
import { relatedPromptsResponseMapper } from '../mappers/responses/related-prompts-response.mapper';
import { getBeaconServiceUrl } from './utils';

/**
 * Default adapter for the related prompt endpoint.
 * This endpoint does not support pagination in the request.
 *
 * @public
 */
export const relatedPromptsEndpointAdapter = endpointAdapterFactory<
  RelatedPromptsRequest,
  RelatedPromptsResponse
>({
  endpoint:
    'https://api.empathy.co/relatedprompts/mymotivemarketplace?store=Labstore+London&lang=en',
  requestMapper: ({ query }) => ({ query }),
  responseMapper: relatedPromptsResponseMapper,
  defaultRequestOptions: {
    id: 'related-prompts',
    parameters: {
      internal: true
    }
  }
});
