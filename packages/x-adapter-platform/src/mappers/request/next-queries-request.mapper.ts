import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { NextQueriesRequest } from '@empathyco/x-types';
import { nextQueriesRequestSchema } from '../../schemas/request/next-queries-request.schema';
import {
  BasePlatformNextQueriesRequest,
  PlatformNextQueriesRequest
} from '../../types/requests/next-queries-request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const nextQueriesRequestMapper = combineMappers<
  NextQueriesRequest,
  PlatformNextQueriesRequest
>(
  schemaMapperFactory<NextQueriesRequest, BasePlatformNextQueriesRequest>(nextQueriesRequestSchema),
  extraParamsRequestMapper
);
