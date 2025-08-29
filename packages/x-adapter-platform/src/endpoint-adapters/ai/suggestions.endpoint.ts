import type { AiQuestionsRequest } from '@empathyco/x-types'
import { endpointAdapterFactory, fetchRawHttpClient, interpolate } from '@empathyco/x-adapter'
import { aiQuestionsRequestMapper } from '../../mappers'
import { getDefaultHeaders, getOverviewSuggestionsServiceUrl } from '../utils'

/**
 * Default adapter for the Overview suggestions v1 endpoint.
 *
 * @public
 */
export const aiSuggestionsEndpointAdapter = endpointAdapterFactory<AiQuestionsRequest, Response>({
  endpoint: from =>
    interpolate(
      `${getOverviewSuggestionsServiceUrl(from)}/{extraParams.instance}/suggestions`,
      from,
    ),
  httpClient: fetchRawHttpClient,
  requestMapper: aiQuestionsRequestMapper,
  defaultRequestOptions: {
    id: 'ai-overview-suggestions',
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
