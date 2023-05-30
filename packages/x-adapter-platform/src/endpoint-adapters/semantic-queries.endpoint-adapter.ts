import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { SemanticQueriesResponse, SemanticQueriesRequest } from '@empathyco/x-types';
import { semanticQueriesRequestMapper } from '../mappers/requests/semantic-queries-request.mapper';
// eslint-disable-next-line max-len
import { semanticQueriesResponseMapper } from '../mappers/responses/semantic-queries-response.mapper';

/**
 * Default adapter for the semantic queries endpoint.
 *
 * @public
 */
export const semanticQueriesEndpointAdapter = endpointAdapterFactory<
  SemanticQueriesRequest,
  SemanticQueriesResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/semantics-api/search-single/{extraParams.instance}',
  requestMapper: semanticQueriesRequestMapper,
  responseMapper: semanticQueriesResponseMapper,
  defaultRequestOptions: {
    id: 'semantic-queries'
  }
});
