import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { SearchRequest, SearchResponse } from '@empathyco/x-types';
import { searchRequestMapper } from '../mappers/requests/search-request.mapper';
import { searchResponseMapper } from '../mappers/responses/search-response.mapper';
import { getSearchServiceUrl } from './utils';

/**
 * Default adapter for the search endpoint.
 *
 * @public
 */
export const searchEndpointAdapter = endpointAdapterFactory<SearchRequest, SearchResponse>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/search`, from),
  requestMapper: searchRequestMapper,
  responseMapper: searchResponseMapper,
  defaultRequestOptions: {
    id: 'search',
    parameters: {
      internal: true
    }
  }
});
