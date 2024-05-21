import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { QuerySuggestionsRequest, QuerySuggestionsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsRequestMapper } from '../mappers/requests/query-suggestions-request.mapper';
// eslint-disable-next-line max-len
import { querySuggestionsResponseMapper } from '../mappers/responses/query-suggestions-response.mapper';
import { getSearchServiceUrl } from './utils';

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
    parameters: {
      internal: true
    }
  }
});
