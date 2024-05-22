import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { IdentifierResultsRequest, IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsRequestMapper } from '../mappers/requests/identifier-results-request.mapper';
// eslint-disable-next-line max-len
import { identifierResultsResponseMapper } from '../mappers/responses/identifier-results-response.mapper';
import { getSearchServiceUrl } from './utils';

/**
 * Default adapter for the identifier results endpoint.
 *
 * @public
 */
export const identifierResultsEndpointAdapter = endpointAdapterFactory<
  IdentifierResultsRequest,
  IdentifierResultsResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/skusearch`, from),
  requestMapper: identifierResultsRequestMapper,
  responseMapper: identifierResultsResponseMapper,
  defaultRequestOptions: {
    id: 'identifier-results',
    parameters: {
      internal: true
    }
  }
});
