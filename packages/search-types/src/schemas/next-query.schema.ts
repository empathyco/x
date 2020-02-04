import { NextQuery } from '../query-signals/next-query.model';

/**
 * @public
 * Jest schema for validating Next query entities
 */
export const NextQuerySchema: NextQuery = {
  id: expect.any(String),
  modelName: expect.any(String),
  numFound: expect.any(Number),
  query: expect.any(String),
  results: expect.any(Array),
  resultsFacets: expect.any(Object)
};
