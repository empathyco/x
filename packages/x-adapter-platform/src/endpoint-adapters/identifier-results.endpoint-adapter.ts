import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { IdentifierResultsRequest, IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsRequestMapper } from '../mappers/request/identifier-results-request.mapper';
// eslint-disable-next-line max-len
import { identifierResultsResponseMapper } from '../mappers/response/identifier-results-response.mapper';

export const identifierResultsEndpointAdapter = endpointAdapterFactory<
  IdentifierResultsRequest,
  IdentifierResultsResponse
>({
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/skusearch',
  requestMapper: identifierResultsRequestMapper,
  responseMapper: identifierResultsResponseMapper
});
