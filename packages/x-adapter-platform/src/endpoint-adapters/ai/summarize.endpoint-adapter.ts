import type { AiSuggestionsRequest } from '@empathyco/x-types'
import { endpointAdapterFactory, fetchRawHttpClient, interpolate } from '@empathyco/x-adapter'
import { aiSuggestionsRequestMapper } from '../../mappers'
import { getAiSuggestionsServiceUrl, getDefaultHeaders } from '../utils'

/**
 * Default adapter for the Overview summarize streaming endpoint.
 *
 * Mirrors the aiSuggestions endpoint adapter.
 *
 * @public
 */
export const aiSummarizeEndpointAdapter = endpointAdapterFactory<AiSuggestionsRequest, Response>({
  endpoint: from =>
    interpolate(`${getAiSuggestionsServiceUrl(from)}/{extraParams.instance}/summarize`, from),
  httpClient: fetchRawHttpClient,
  requestMapper: aiSuggestionsRequestMapper,
  defaultRequestOptions: {
    id: 'ai-overview-summarize',
    properties: {
      method: 'POST',
      headers: {
        accept: 'text/event-stream',
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
