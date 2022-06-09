import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { NextQueriesRequest } from '@empathyco/x-types';
import { PlatformNextQueriesRequest } from '../../types/request/next-queries-request.model';

export const nextQueriesRequestSchema: Schema<NextQueriesRequest, PlatformNextQueriesRequest> = {
  query: 'query',
  extraParams: 'extraParams'
};

export const nextQueriesRequestMutableSchema = createMutableSchema(nextQueriesRequestSchema);
