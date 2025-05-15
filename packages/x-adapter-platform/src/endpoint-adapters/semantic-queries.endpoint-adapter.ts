import type { SemanticQueriesRequest, SemanticQueriesResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { semanticQueriesRequestMapper } from '../mappers/requests/semantic-queries-request.mapper'
import { semanticQueriesResponseMapper } from '../mappers/responses/semantic-queries-response.mapper'
import { getDefaultHeaders, getSemanticsServiceUrl } from './utils'

/**
 * Default adapter for the semantic queries endpoint.
 *
 * @public
 */
export const semanticQueriesEndpointAdapter = endpointAdapterFactory<
  SemanticQueriesRequest,
  SemanticQueriesResponse
>({
  endpoint: from =>
    interpolate(`${getSemanticsServiceUrl(from)}/search_single/{extraParams.instance}`, from),
  requestMapper: semanticQueriesRequestMapper,
  responseMapper: semanticQueriesResponseMapper,
  defaultRequestOptions: {
    id: 'semantic-queries',
    properties: {
      headers: getDefaultHeaders(),
    },
  },
})
