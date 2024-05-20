import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { NextQueriesRequest, NextQueriesResponse } from '@empathyco/x-types';
import { nextQueriesRequestMapper } from '../mappers/requests/next-queries-request.mapper';
import { nextQueriesResponseMapper } from '../mappers/responses/next-queries-response.mapper';
import { getBeaconServiceUrl } from './utils';

/**
 * This endpoint does not support pagination in the request.
 *
 * @public
 */
export const nextQueriesEndpointAdapter = endpointAdapterFactory<
  NextQueriesRequest,
  NextQueriesResponse
>({
  endpoint: from =>
    interpolate(`${getBeaconServiceUrl(from)}/nextqueries/{extraParams.instance}`, from),
  requestMapper: nextQueriesRequestMapper,
  responseMapper: nextQueriesResponseMapper,
  defaultRequestOptions: {
    id: 'next-queries',
    parameters: {
      internal: true
    }
  }
});
