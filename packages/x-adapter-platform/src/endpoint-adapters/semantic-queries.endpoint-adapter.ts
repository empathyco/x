import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { SemanticQueriesResponse, SemanticQueriesRequest } from '@empathyco/x-types';
import { semanticQueriesRequestMapper } from '../mappers/requests/semantic-queries-request.mapper';
// eslint-disable-next-line max-len
import { semanticQueriesResponseMapper } from '../mappers/responses/semantic-queries-response.mapper';

export const semanticQueriesEndpointAdapter = endpointAdapterFactory<
  SemanticQueriesRequest,
  SemanticQueriesResponse
>({
  //TODO: change environment with an extra param
  endpoint: 'https://semantics-api.internal.prod.empathy.co/search_single/{extraParams.instance}',
  requestMapper: semanticQueriesRequestMapper,
  responseMapper: semanticQueriesResponseMapper,
  defaultRequestOptions: {
    id: 'semantic-queries'
  }
});
