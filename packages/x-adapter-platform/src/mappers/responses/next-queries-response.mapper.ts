import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { NextQueriesResponse, PlatformNextQueriesResponse } from '../../types/response.types';
import { nextQueryMutableSchema } from '../../schemas/next-query.schema';

export const nextQueriesResponseSchema: Schema<PlatformNextQueriesResponse, NextQueriesResponse> = {
  nextQueries: {
    $path: 'data.nextqueries',
    $subSchema: nextQueryMutableSchema
  }
};

export const nextQueriesReponseMutableSchema = createMutableSchema(nextQueriesResponseSchema);

export const nextQueriesResponseMapper = schemaMapperFactory<
  PlatformNextQueriesResponse,
  NextQueriesResponse
>(nextQueriesReponseMutableSchema);
