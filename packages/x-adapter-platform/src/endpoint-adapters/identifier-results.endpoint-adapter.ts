import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { IdentifierResultsRequest, IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsRequestMapper } from '../mappers/request/identifier-results-request.mapper';
import { skuSearchResponseMapper } from '../mappers/response/sku-search-response.mapper';

const identifierResultsEndpointAdapterOptions: EndpointAdapterOptions<
  IdentifierResultsRequest,
  IdentifierResultsResponse
> = {
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/skusearch',
  requestMapper: identifierResultsRequestMapper,
  responseMapper: skuSearchResponseMapper
};

export const identifierResultsEndpointAdapter = endpointAdapterFactory(
  identifierResultsEndpointAdapterOptions
);
