import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { NextQuery } from '@empathyco/x-types';
import { PlatformNextQuery } from '../../types/models/next-query.model';

export const nextQuerySchema = createMutableSchema<Schema<PlatformNextQuery, NextQuery>>({
  query: 'query',
  results: () => [],
  facets: () => [],
  modelName: () => 'NextQuery',
  totalResults: () => 0,
  isCurated: ({ source }) => source === 'CURATED'
});
