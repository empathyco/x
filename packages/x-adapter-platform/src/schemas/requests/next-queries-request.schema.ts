import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { NextQueriesRequest } from '@empathyco/x-types';
import { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model';

export const nextQueriesRequestSchema = createMutableSchema<
  Schema<NextQueriesRequest, PlatformNextQueriesRequest>
>({
  query: 'query',
  extraParams: 'extraParams'
});
