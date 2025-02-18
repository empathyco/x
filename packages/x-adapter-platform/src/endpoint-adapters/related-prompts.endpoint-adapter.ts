import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types';
import { relatedPromptsResponseMapper } from '../mappers/responses/related-prompts-response.mapper';
import { relatedPromptsRequestMapper } from '../mappers/index';
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
  endpoint: from =>
    interpolate(`${getBeaconServiceUrl(from)}/relatedprompts/{extraParams.instance}`, from),
  requestMapper: relatedPromptsRequestMapper,
  responseMapper: relatedPromptsResponseMapper,
  defaultRequestOptions: {
    id: 'related-prompts',
    parameters: {
      internal: true
    }
  }
});
