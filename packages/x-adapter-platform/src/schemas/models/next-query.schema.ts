import { createMutableSchema } from '@empathyco/x-adapter';
import { NextQuery } from '@empathyco/x-types';
import { PlatformNextQuery } from '../../types/models/next-query.model';

/**
 * Default implementation for the NextQuerySchema.
 *
 * @public
 */
export const nextQuerySchema = createMutableSchema<PlatformNextQuery, NextQuery>({
  query: 'query',
  results: () => [],
  facets: () => [],
  modelName: () => 'NextQuery',
  totalResults: () => 0,
  isCurated: ({ source }) => source === 'CURATED'
});
