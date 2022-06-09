import { Schema, createMutableSchema } from '@empathyco/x-adapter-next';
import { NextQueriesResponse } from '@empathyco/x-types';
import { PlatformNextQueriesResponse } from '../../types/response/next-queries-response.model';
import { nextQueryMutableSchema } from './models/next-query.schema';

export const nextQueriesResponseSchema: Schema<PlatformNextQueriesResponse, NextQueriesResponse> = {
  nextQueries: {
    $path: 'data.nextqueries',
    $subSchema: nextQueryMutableSchema
  }
};

export const nextQueriesResponseMutableSchema = createMutableSchema(nextQueriesResponseSchema);
