import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { NextQueriesRequest, NextQueriesResponse } from '@empathyco/x-types';
import { nextQueriesRequestMapper } from '../mappers/requests/next-queries-request.mapper';
import { nextQueriesResponseMapper } from '../mappers/responses/next-queries-response.mapper';

/**
 * This endpoint does not support pagination in the request.
 *
 * @public
 */
export const nextQueriesEndpointAdapter = endpointAdapterFactory<
  NextQueriesRequest,
  NextQueriesResponse
>({
  endpoint: 'https://api.{extraParams.env(.)}empathy.co/nextqueries/{extraParams.instance}',
  requestMapper: nextQueriesRequestMapper,
  responseMapper: nextQueriesResponseMapper,
  defaultRequestOptions: {
    id: 'next-queries'
  }
});
