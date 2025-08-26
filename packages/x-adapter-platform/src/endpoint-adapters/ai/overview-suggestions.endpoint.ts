import type { AiQuestionsRequest, AiQuestionsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { aiQuestionsRequestMapper, aiQuestionsResponseMapper } from '../../mappers'
import { getDefaultHeaders, getOverviewSuggestionsServiceUrl } from '../utils'

/**
 * Default adapter for the Overview suggestions v1 endpoint.
 *
 * @public
 */
export const aiOverviewSuggestionsEndpointAdapter = endpointAdapterFactory<
  AiQuestionsRequest,
  AiQuestionsResponse
>({
  endpoint: from =>
    interpolate(
      `${getOverviewSuggestionsServiceUrl(from)}/{extraParams.instance}/suggestions`,
      from,
    ),
  requestMapper: aiQuestionsRequestMapper,
  responseMapper: aiQuestionsResponseMapper,
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
