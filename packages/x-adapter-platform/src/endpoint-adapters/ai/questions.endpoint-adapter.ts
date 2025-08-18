import type { AiQuestionsRequest, AiQuestionsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { AiQuestionsRequestMapper, AiQuestionsResponseMapper } from '../../mappers'
import { getBeaconServiceUrl } from '../utils'

/**
 * Default adapter for the questions v1 endpoint.
 *
 * @public
 */
export const AiQuestionsEndpointAdapter = endpointAdapterFactory<
  AiQuestionsRequest,
  AiQuestionsResponse
>({
  endpoint: from =>
    interpolate(
      `${getBeaconServiceUrl(from)}/questions/{extraParams.instance}/conversational`,
      from,
    ),
  requestMapper: AiQuestionsRequestMapper,
  responseMapper: AiQuestionsResponseMapper,
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
