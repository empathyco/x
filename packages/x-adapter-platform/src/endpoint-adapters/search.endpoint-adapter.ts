import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { SearchRequest, SearchResponse } from '@empathyco/x-types';
import { searchRequestMapper } from '../mappers/requests/search-request.mapper';
import { searchResponseMapper } from '../mappers/responses/search-response.mapper';

export const searchEndpointAdapter = endpointAdapterFactory<SearchRequest, SearchResponse>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/search',
  requestMapper: searchRequestMapper,
  responseMapper: searchResponseMapper,
  defaultRequestOptions: {
    id: 'search'
  }
});
