import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types';
import { relatedPromptsRequestMapper } from '../mappers/requests/related-prompts-request.mapper';
import { relatedPromptsResponseMapper } from '../mappers/responses/related-prompts-response.mapper';
import { getSearchServiceUrl } from './utils';

/**
 * This endpoint does not support pagination in the request.
 */
export const relatedPromptsEndpointAdapter = endpointAdapterFactory<
  RelatedPromptsRequest,
  RelatedPromptsResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/relatedprompts/{extraParams.instance}`, from),
  requestMapper: relatedPromptsRequestMapper,
  responseMapper: relatedPromptsResponseMapper,
  defaultRequestOptions: {
    id: 'related-prompts',
    parameters: {
      internal: true
    }
  }
});
