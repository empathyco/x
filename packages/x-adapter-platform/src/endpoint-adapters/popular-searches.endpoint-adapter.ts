import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { PopularSearchesRequest, PopularSearchesResponse } from '@empathyco/x-types';
import { popularSearchesRequestMapper } from '../mappers/requests/popular-searches-request.mapper';
// eslint-disable-next-line max-len
import { popularSearchesResponseMapper } from '../mappers/responses/popular-searches-response.mapper';

/**
 * Default adapter for the popular searches endpoint.
 *
 * @public
 */
export const popularSearchesEndpointAdapter = endpointAdapterFactory<
  PopularSearchesRequest,
  PopularSearchesResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/empathize',
  requestMapper: popularSearchesRequestMapper,
  responseMapper: popularSearchesResponseMapper,
  defaultRequestOptions: {
    id: 'popular-searches',
    parameters: {
      internal: true
    }
  }
});
