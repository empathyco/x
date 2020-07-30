import { NextQuery } from '../query-signals/next-query.model';

/**
 * @public
 * Jest schema for validating Next query entities
 */
export const NextQuerySchema: NextQuery = {
  modelName: expect.any(String),
  query: expect.any(String),
  facets: expect.any(Array),
  totalResults: expect.any(Number),
  results: expect.any(Array)
};
