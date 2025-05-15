import type { IdentifierResultsRequest, IdentifierResultsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { identifierResultsRequestMapper } from '../mappers/requests/identifier-results-request.mapper'
import { identifierResultsResponseMapper } from '../mappers/responses/identifier-results-response.mapper'
import { getDefaultHeaders, getSearchServiceUrl } from './utils'

/**
 * Default adapter for the identifier results endpoint.
 *
 * @public
 */
export const identifierResultsEndpointAdapter = endpointAdapterFactory<
  IdentifierResultsRequest,
  IdentifierResultsResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/skusearch`, from),
  requestMapper: identifierResultsRequestMapper,
  responseMapper: identifierResultsResponseMapper,
  defaultRequestOptions: {
    id: 'identifier-results',
    properties: {
      headers: getDefaultHeaders(),
    },
    parameters: {
      internal: true,
    },
  },
})
