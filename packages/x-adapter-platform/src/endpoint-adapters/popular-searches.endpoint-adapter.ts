import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { PopularSearchesRequest, PopularSearchesResponse } from '@empathyco/x-types';
import { popularSearchesRequestMapper } from '../mappers/request/popular-searches-request.mapper';
// eslint-disable-next-line max-len
import { popularSearchesResponseMapper } from '../mappers/response/popular-searches-response.mapper';

export const popularSearchesEndpointAdapter = endpointAdapterFactory<
  PopularSearchesRequest,
  PopularSearchesResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/empathize',
  requestMapper: popularSearchesRequestMapper,
  responseMapper: popularSearchesResponseMapper
});
