import type { NextQueriesRequest } from '@empathyco/x-types';
import type { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model';
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the NextQueriesRequestSchema.
 *
 * @public
 */
export const nextQueriesRequestSchema = createMutableSchema<
  NextQueriesRequest,
  PlatformNextQueriesRequest
>({
  query: 'query',
  extraParams: 'extraParams'
});
