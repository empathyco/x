import type { AiTasksRequest, AiTasksResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { aiTasksRequestMapper, aiTasksResponseMapper } from '../../mappers'
import { getDefaultHeaders, getQuestionsServiceUrl } from '../utils'

/**
 * Default adapter for the questions v1 endpoint.
 *
 * @public
 */
export const aiTasksEndpointAdapter = endpointAdapterFactory<AiTasksRequest, AiTasksResponse>({
  endpoint: from => interpolate(`${getQuestionsServiceUrl(from)}/tasks/{taskId}`, from),
  requestMapper: aiTasksRequestMapper,
  responseMapper: aiTasksResponseMapper,
  defaultRequestOptions: {
    id: 'ai-tasks',
    properties: {
      headers: getDefaultHeaders(),
    },
    parameters: {
      internal: true,
    },
    cancelable: false,
  },
})
