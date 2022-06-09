import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { NextQuery } from '@empathyco/x-types';
import { PlatformNextQuery } from '../../../types/response/models/next-query.model';

export const nextQuerySchema: Schema<PlatformNextQuery, NextQuery> = {
  query: 'query',
  results: () => [],
  facets: () => [],
  modelName: () => 'NextQuery',
  totalResults: () => 0,
  isCurated: ({ source }) => source === 'CURATED'
};

export const nextQueryMutableSchema = createMutableSchema(nextQuerySchema);
