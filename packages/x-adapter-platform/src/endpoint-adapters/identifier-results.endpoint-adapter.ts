import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { IdentifierResultsRequest, IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsRequestMapper } from '../mappers/requests/identifier-results-request.mapper';
// eslint-disable-next-line max-len
import { identifierResultsResponseMapper } from '../mappers/responses/identifier-results-response.mapper';

export const identifierResultsEndpointAdapter = endpointAdapterFactory<
  IdentifierResultsRequest,
  IdentifierResultsResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/skusearch',
  requestMapper: identifierResultsRequestMapper,
  responseMapper: identifierResultsResponseMapper,
  defaultRequestOptions: {
    id: 'identifier-results'
  }
});
