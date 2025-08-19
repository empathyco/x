import type { AiQuestionsRequest, AiQuestionsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { aiQuestionsRequestMapper, aiQuestionsResponseMapper } from '../../mappers'
import { getDefaultHeaders, getQuestionsServiceUrl } from '../utils'

/**
 * Default adapter for the questions v1 endpoint.
 *
 * @public
 */
export const aiQuestionsEndpointAdapter = endpointAdapterFactory<
  AiQuestionsRequest,
  AiQuestionsResponse
>({
  endpoint: from =>
    interpolate(
      `${getQuestionsServiceUrl(from)}/questions/{extraParams.instance}/conversational`,
      from,
    ),
  requestMapper: aiQuestionsRequestMapper,
  responseMapper: aiQuestionsResponseMapper,
  defaultRequestOptions: {
    id: 'ai-questions',
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
    cancelable: false,
    sendParamsInBody: true,
  },
})
