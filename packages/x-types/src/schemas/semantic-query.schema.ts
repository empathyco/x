import type { SemanticQuery } from '../query-signals/semantic-query.model';

/**
 * Jest schema for validating SemanticQuery entities.
 *
 * @public
 */
export const SemanticQuerySchema: SemanticQuery = {
  modelName: expect.any(String),
  query: expect.any(String),
  distance: expect.any(Number)
};
