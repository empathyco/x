import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types';
import { relatedPromptsRequestMapper } from '../mappers/requests/related-prompts-request.mapper';
import { relatedPromptsResponseMapper } from '../mappers/responses/related-prompts-response.mapper';

/**
 * This endpoint does not support pagination in the request.
 */
export const relatedPromptsEndpointAdapter = endpointAdapterFactory<
  RelatedPromptsRequest,
  RelatedPromptsResponse
>({
  endpoint: 'https://api.staging.empathy.co/relatedprompts/fmj?',
  requestMapper: relatedPromptsRequestMapper,
  responseMapper: relatedPromptsResponseMapper
});
