import { Schema, createMutableSchema } from '@empathyco/x-adapter-next';
import { NextQueriesResponse } from '@empathyco/x-types';
import { nextQueryMutableSchema } from '../next-query.schema';
import { PlatformNextQueriesResponse } from '../../types/responses/next-queries-response.model';

export const nextQueriesResponseSchema: Schema<PlatformNextQueriesResponse, NextQueriesResponse> = {
  nextQueries: {
    $path: 'data.nextqueries',
    $subSchema: nextQueryMutableSchema
  }
};

export const nextQueriesResponseMutableSchema = createMutableSchema(nextQueriesResponseSchema);
