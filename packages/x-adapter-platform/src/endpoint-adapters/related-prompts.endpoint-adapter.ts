import type { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { relatedPromptsRequestMapper } from '../mappers/index'
import { relatedPromptsResponseMapper } from '../mappers/responses/related-prompts-response.mapper'
import { getBeaconServiceUrl, getDefaultHeaders } from './utils'

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
    properties: {
      headers: getDefaultHeaders(),
    },
    parameters: {
      internal: true,
    },
  },
})
