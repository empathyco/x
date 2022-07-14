import { schemaMapperFactory } from '@empathyco/x-adapter';
import { NextQueriesResponse } from '@empathyco/x-types';
import { nextQueriesResponseSchema } from '../../schemas/responses';
import { PlatformNextQueriesResponse } from '../../types/responses/next-queries-response.model';

export const nextQueriesResponseMapper = schemaMapperFactory<
  PlatformNextQueriesResponse,
  NextQueriesResponse
>(nextQueriesResponseSchema);
