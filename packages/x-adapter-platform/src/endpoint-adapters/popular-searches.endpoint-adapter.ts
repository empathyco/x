import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { PopularSearchesRequest, PopularSearchesResponse } from '@empathyco/x-types';
import { popularSearchesRequestMapper } from '../mappers/requests/popular-searches-request.mapper';
// eslint-disable-next-line max-len
import { popularSearchesResponseMapper } from '../mappers/responses/popular-searches-response.mapper';
import { getSearchServiceUrl } from './utils';

/**
 * Default adapter for the popular searches endpoint.
 *
 * @public
 */
export const popularSearchesEndpointAdapter = endpointAdapterFactory<
  PopularSearchesRequest,
  PopularSearchesResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/empathize`, from),
  requestMapper: popularSearchesRequestMapper,
  responseMapper: popularSearchesResponseMapper,
  defaultRequestOptions: {
    id: 'popular-searches',
    parameters: {
      internal: true
    }
  }
});
