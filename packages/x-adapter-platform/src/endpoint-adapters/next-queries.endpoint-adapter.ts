import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { BaseRequest } from '../types/request.types';
import { NextQueriesResponse } from '../types/response.types';
import { nextQueriesResponseMapper } from '../mappers/response/next-queries-response.mapper';
import { baseRequestMapper } from '../mappers/request/base-request.mapper';

export const nextQueriesEndpointAdapterOptions: EndpointAdapterOptions<
  BaseRequest,
  NextQueriesResponse
> = {
  endpoint: 'https://api.{env(.)}empathy.co/nextqueries/{instance}',
  responseMapper: nextQueriesResponseMapper,
  requestMapper: baseRequestMapper
};

export const nextQueriesEndpointAdapter = endpointAdapterFactory(nextQueriesEndpointAdapterOptions);
