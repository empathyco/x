import { createMutableSchema } from '@empathyco/x-adapter';
import { NextQueriesResponse } from '@empathyco/x-types';
import { PlatformNextQueriesResponse } from '../../types/responses/next-queries-response.model';
import { nextQuerySchema } from '../models/next-query.schema';

export const nextQueriesResponseSchema = createMutableSchema<
  PlatformNextQueriesResponse,
  NextQueriesResponse
>({
  nextQueries: {
    $path: 'data.nextqueries',
    $subSchema: nextQuerySchema
  }
});
