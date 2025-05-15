import type { PopularSearchesRequest, PopularSearchesResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { popularSearchesRequestMapper } from '../mappers/requests/popular-searches-request.mapper'
import { popularSearchesResponseMapper } from '../mappers/responses/popular-searches-response.mapper'
import { getDefaultHeaders, getSearchServiceUrl } from './utils'

/**
 * Default adapter for the popular searches endpoint.
 *
 * @public
 */
export const popularSearchesEndpointAdapter = endpointAdapterFactory<
  PopularSearchesRequest,
  PopularSearchesResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/empathize`, from),
  requestMapper: popularSearchesRequestMapper,
  responseMapper: popularSearchesResponseMapper,
  defaultRequestOptions: {
    id: 'popular-searches',
    properties: {
      headers: getDefaultHeaders(),
    },
    parameters: {
      internal: true,
    },
  },
})
