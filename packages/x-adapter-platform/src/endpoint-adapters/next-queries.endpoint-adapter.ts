import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { NextQueriesRequest, NextQueriesResponse } from '@empathyco/x-types';
import { nextQueriesRequestMapper } from '../mappers/request/next-queries-request.mapper';
import { nextQueriesResponseMapper } from '../mappers/response/next-queries-response.mapper';

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
  responseMapper: nextQueriesResponseMapper
});
