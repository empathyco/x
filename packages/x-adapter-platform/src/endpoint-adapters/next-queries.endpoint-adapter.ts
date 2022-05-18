import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { NextQueriesRequest, NextQueriesResponse } from '@empathyco/x-types';
import { nextQueriesRequestMapper } from '../mappers/request/next-queries-request.mapper';
import { nextQueriesResponseMapper } from '../mappers/response/next-queries-response.mapper';

export const nextQueriesEndpointAdapter = endpointAdapterFactory<
  NextQueriesRequest,
  NextQueriesResponse
>({
  endpoint: 'https://api.{env(.)}empathy.co/nextqueries/{instance}',
  requestMapper: nextQueriesRequestMapper,
  responseMapper: nextQueriesResponseMapper
});
