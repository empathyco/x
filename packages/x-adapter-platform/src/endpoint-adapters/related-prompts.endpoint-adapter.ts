import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types';
import { relatedPromptsResponseMapper } from '../mappers/responses/related-prompts-response.mapper';

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
  endpoint: 'https://beacon-api.internal.test.empathy.co/relatedprompts/empathy?',
  requestMapper: ({ query }) => ({ query, lang: 'es' }),
  responseMapper: relatedPromptsResponseMapper,
  defaultRequestOptions: {
    id: 'related-prompts',
    parameters: {
      internal: true
    }
  }
});
