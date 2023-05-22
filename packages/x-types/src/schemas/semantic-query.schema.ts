import { SemanticQuery } from '../query-signals/semantic-query.model';

export const SemanticQuerySchema: SemanticQuery = {
  modelName: expect.any(String),
  query: expect.any(String),
  distance: expect.any(Number)
};
