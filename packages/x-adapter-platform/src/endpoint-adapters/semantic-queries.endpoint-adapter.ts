import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { SemanticQueriesResponse, SemanticQueriesRequest } from '@empathyco/x-types';
import { semanticQueriesRequestMapper } from '../mappers/requests/semantic-queries-request.mapper';
// eslint-disable-next-line max-len
import { semanticQueriesResponseMapper } from '../mappers/responses/semantic-queries-response.mapper';
import { getSemanticsServiceUrl } from './utils';

/**
 * Default adapter for the semantic queries endpoint.
 *
 * @public
 */
export const semanticQueriesEndpointAdapter = endpointAdapterFactory<
  SemanticQueriesRequest,
  SemanticQueriesResponse
>({
  endpoint: from =>
    interpolate(`${getSemanticsServiceUrl(from)}/search_single/{extraParams.instance}`, from),
  requestMapper: semanticQueriesRequestMapper,
  responseMapper: semanticQueriesResponseMapper,
  defaultRequestOptions: {
    id: 'semantic-queries'
  }
});
