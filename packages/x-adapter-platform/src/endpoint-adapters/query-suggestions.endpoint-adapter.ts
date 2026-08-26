import type { Mapper } from '@empathyco/x-adapter'
import type { QuerySuggestionsRequest, QuerySuggestionsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { querySuggestionsRequestMapper } from '../mappers/requests/query-suggestions-request.mapper'
import { querySuggestionsResponseMapper } from '../mappers/responses/query-suggestions-response.mapper'
import { getSearchServiceUrl } from './utils'

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
  responseMapper: querySuggestionsResponseMapper as Mapper<any, QuerySuggestionsResponse>,
  defaultRequestOptions: {
    id: 'query-suggestions',
    parameters: {
      internal: true,
    },
  },
})
