import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { QuerySuggestionsRequest, QuerySuggestionsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsRequestMapper } from '../mappers/requests/query-suggestions-request.mapper';
// eslint-disable-next-line max-len
import { querySuggestionsResponseMapper } from '../mappers/responses/query-suggestions-response.mapper';

export const querySuggestionsEndpointAdapter = endpointAdapterFactory<
  QuerySuggestionsRequest,
  QuerySuggestionsResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/empathize',
  requestMapper: querySuggestionsRequestMapper,
  responseMapper: querySuggestionsResponseMapper,
  defaultRequestOptions: {
    id: 'query-suggestions'
  }
});
