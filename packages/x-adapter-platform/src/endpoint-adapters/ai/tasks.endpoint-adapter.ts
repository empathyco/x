import type { AiTasksRequest, AiTasksResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { aiTasksRequestMapper, aiTasksResponseMapper } from '../../mappers'
import { getDefaultParams, getTasksServiceUrl } from '../utils'

/**
 * Default adapter for the questions v1 endpoint.
 *
 * @public
 */
export const aiTasksEndpointAdapter = endpointAdapterFactory<AiTasksRequest, AiTasksResponse>({
  endpoint: from => interpolate(`${getTasksServiceUrl(from)}/tasks/{taskId}`, from),
  requestMapper: aiTasksRequestMapper,
  responseMapper: aiTasksResponseMapper,
  defaultRequestOptions: {
    id: 'ai-tasks',
    parameters: {
      ...getDefaultParams(),
      internal: true,
    },
    cancelable: false,
  },
})
