import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { QuerySuggestionsRequest, QuerySuggestionsResponse } from '@empathyco/x-types';
import { querySuggestionsRequestMapper } from '../mappers/request/query-suggestions-request.mapper';
// eslint-disable-next-line max-len
import { querySuggestionsResponseMapper } from '../mappers/response/query-suggestions-response.mapper';

export const querySuggestionsEndpointAdapter = endpointAdapterFactory<
  QuerySuggestionsRequest,
  QuerySuggestionsResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/empathize',
  requestMapper: querySuggestionsRequestMapper,
  responseMapper: querySuggestionsResponseMapper
});
