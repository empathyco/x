import type { BrowseRequest, BrowseResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { browseRequestMapper } from '../mappers/requests/browse-request.mapper'
import { browseResponseMapper } from '../mappers/responses/browse-response.mapper'
import { getSearchServiceUrl } from './utils'

/**
 * Default adapter for the browse endpoint.
 *
 * @public
 */
export const browseEndpointAdapter = endpointAdapterFactory<BrowseRequest, BrowseResponse>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/browse`, from),
  requestMapper: browseRequestMapper,
  responseMapper: browseResponseMapper,
  defaultRequestOptions: {
    id: 'browse',
    parameters: {
      internal: true,
    },
  },
})
