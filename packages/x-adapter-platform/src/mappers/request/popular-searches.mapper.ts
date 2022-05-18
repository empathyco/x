import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { popularSearchesRequestMutableSchema } from '../../schemas/request/popular-searches-request.schema';
import {
  BasePlatformPopularSearchesRequest,
  PlatformPopularSearchesRequest
} from '../../types/requests/popular-searches.request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const popularSearchesRequestMapper = combineMappers<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>(
  schemaMapperFactory<PopularSearchesRequest, BasePlatformPopularSearchesRequest>(
    popularSearchesRequestMutableSchema
  ),
  extraParamsRequestMapper
);
