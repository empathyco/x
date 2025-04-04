import type { NextQueriesResponse } from '@empathyco/x-types';
import type { PlatformNextQueriesResponse } from '../../types/responses/next-queries-response.model';
import { createMutableSchema } from '@empathyco/x-adapter';
import { nextQuerySchema } from '../models/next-query.schema';

/**
 * Default implementation for the NextQueriesResponseSchema.
 *
 * @public
 */
export const nextQueriesResponseSchema = createMutableSchema<
  PlatformNextQueriesResponse,
  NextQueriesResponse
>({
  nextQueries: {
    $path: 'data.nextqueries',
    $subSchema: nextQuerySchema
  }
});
