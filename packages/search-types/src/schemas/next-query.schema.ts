import { NextQuery } from '../query-signals/next-query.model';

/**
 * Jest schema for validating Next query entities.
 *
 * @public
 */
export const NextQuerySchema: NextQuery = {
  modelName: expect.any(String),
  query: expect.any(String),
  facets: expect.any(Array),
  totalResults: expect.any(Number),
  results: expect.any(Array)
};
