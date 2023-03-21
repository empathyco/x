import { createMutableSchema } from '@empathyco/x-adapter';
import { NextQueriesRequest } from '@empathyco/x-types';
import { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model';

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
