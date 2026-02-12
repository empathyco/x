import type { FacetsRequest, FacetsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { facetsRequestMapper } from '../mappers/requests/facets-request.mapper'
import { facetsResponseMapper } from '../mappers/responses/facets-response.mapper'
import { getDefaultHeaders, getSearchServiceUrl } from './utils'

/**
 * Default adapter for the facet endpoint.
 *
 * @public
 */
export const facetsEndpointAdapter = endpointAdapterFactory<FacetsRequest, FacetsResponse>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/facets`, from),
  requestMapper: facetsRequestMapper,
  responseMapper: facetsResponseMapper,
  defaultRequestOptions: {
    id: 'facets',
    properties: {
      headers: getDefaultHeaders(),
    },
  },
})
