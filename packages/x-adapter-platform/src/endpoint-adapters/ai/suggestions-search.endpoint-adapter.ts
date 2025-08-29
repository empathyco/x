import type { AiSuggestionsSearchRequest, AiSuggestionsSearchResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { aiSuggestionsSearchRequestMapper, aiSuggestionsSearchResponseMapper } from '../../mappers'
import { getAiSuggestionsServiceUrl, getDefaultHeaders } from '../utils'

/**
 * Default adapter for the ai suggestions search endpoint.
 *
 * @public
 */
export const aiSuggestionsSearchEndpointAdapter = endpointAdapterFactory<
  AiSuggestionsSearchRequest,
  AiSuggestionsSearchResponse
>({
  endpoint: from =>
    interpolate(
      `${getAiSuggestionsServiceUrl(from)}/{extraParams.instance}/suggestions/search`,
      from,
    ),
  requestMapper: aiSuggestionsSearchRequestMapper,
  responseMapper: aiSuggestionsSearchResponseMapper,
  defaultRequestOptions: {
    id: 'ai-suggestions-search',
    properties: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getDefaultHeaders(),
      },
    },
    parameters: {
      internal: true,
    },
    sendParamsInBody: true,
  },
})
