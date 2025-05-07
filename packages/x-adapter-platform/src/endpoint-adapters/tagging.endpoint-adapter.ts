import type { TaggingRequest } from '@empathyco/x-types'
import { endpointAdapterFactory } from '@empathyco/x-adapter'
import { taggingRequestMapper } from '../mappers/requests/tagging-request.mapper'
import { getDefaultHeaders } from './utils'

/**
 * Default adapter for the tagging endpoint.
 *
 * @public
 */
export const taggingEndpointAdapter = endpointAdapterFactory<TaggingRequest, void>({
  endpoint: ({ url }) => url,
  requestMapper: taggingRequestMapper,
  defaultRequestOptions: {
    id: 'tagging',
    cancelable: false,
    properties: {
      keepalive: true,
      headers: getDefaultHeaders(),
    },
  },
})
