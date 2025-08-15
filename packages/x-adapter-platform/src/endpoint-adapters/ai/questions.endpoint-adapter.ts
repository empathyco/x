import type { AIQuestionsRequest, AIQuestionsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { AIQuestionsRequestMapper, AIQuestionsResponseMapper } from '../../mappers'
import { getBeaconServiceUrl } from '../utils'

/**
 * Default adapter for the questions v1 endpoint.
 *
 * @public
 */
export const AIQuestionsEndpointAdapter = endpointAdapterFactory<
  AIQuestionsRequest,
  AIQuestionsResponse
>({
  endpoint: from =>
    interpolate(
      `${getBeaconServiceUrl(from)}/questions/{extraParams.instance}/conversational`,
      from,
    ),
  requestMapper: AIQuestionsRequestMapper,
  responseMapper: AIQuestionsResponseMapper,
  defaultRequestOptions: {
    id: 'ai-questions',
    properties: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    cancelable: false,
    sendParamsInBody: true,
  },
})
