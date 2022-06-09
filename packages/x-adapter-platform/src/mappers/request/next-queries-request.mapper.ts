import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { NextQueriesRequest } from '@empathyco/x-types';
import { nextQueriesRequestSchema } from '../../schemas/request/next-queries-request.schema';
import { PlatformNextQueriesRequest } from '../../types/request/next-queries-request.model';

export const nextQueriesRequestMapper = schemaMapperFactory<
  NextQueriesRequest,
  PlatformNextQueriesRequest
>(nextQueriesRequestSchema);
