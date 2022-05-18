import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { NextQueriesRequest } from '@empathyco/x-types';
import { BasePlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model';

export const nextQueriesRequestSchema: Schema<NextQueriesRequest, BasePlatformNextQueriesRequest> =
  {
    query: 'query'
  };

export const nextQueriesRequestMutableSchema = createMutableSchema(nextQueriesRequestSchema);
