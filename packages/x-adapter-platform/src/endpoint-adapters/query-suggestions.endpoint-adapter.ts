import type { QuerySuggestionsRequest, QuerySuggestionsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { querySuggestionsRequestMapper } from '../mappers/requests/query-suggestions-request.mapper'
import { querySuggestionsResponseMapper } from '../mappers/responses/query-suggestions-response.mapper'
import { getDefaultHeaders, getSearchServiceUrl } from './utils'

/**
 * Default adapter for the query suggestions endpoint.
 *
 * @public
 */
export const querySuggestionsEndpointAdapter = endpointAdapterFactory<
  QuerySuggestionsRequest,
  QuerySuggestionsResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/empathize`, from),
  requestMapper: querySuggestionsRequestMapper,
  responseMapper: querySuggestionsResponseMapper,
  defaultRequestOptions: {
    id: 'query-suggestions',
    properties: {
      headers: getDefaultHeaders(),
    },
    parameters: {
      internal: true,
    },
  },
})
