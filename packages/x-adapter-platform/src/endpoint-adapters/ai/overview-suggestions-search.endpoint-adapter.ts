import type {
  AiOverviewSuggestionsSearchRequest,
  AiOverviewSuggestionsSearchResponse,
} from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import {
  aiOverviewSuggestionsSearchRequestMapper,
  aiOverviewSuggestionsSearchResponseMapper,
} from '../../mappers'
import { getDefaultHeaders, getOverviewSuggestionsServiceUrl } from '../utils'

/**
 * Default adapter for the overview suggestions search endpoint.
 *
 * @public
 */
export const aiOverviewSuggestionsSearchEndpointAdapter = endpointAdapterFactory<
  AiOverviewSuggestionsSearchRequest,
  AiOverviewSuggestionsSearchResponse
>({
  endpoint: from =>
    interpolate(
      `${getOverviewSuggestionsServiceUrl(from)}/{extraParams.instance}/suggestions/search`,
      from,
    ),
  requestMapper: aiOverviewSuggestionsSearchRequestMapper,
  responseMapper: aiOverviewSuggestionsSearchResponseMapper,
  defaultRequestOptions: {
    id: 'ai-overview-suggestions-search',
    properties: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getDefaultHeaders(),
      },
    },
    parameters: {
      internal: true,
    },
    sendParamsInBody: true,
  },
})
