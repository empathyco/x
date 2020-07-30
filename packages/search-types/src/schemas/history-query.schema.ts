import { HistoryQuery } from '../history-query.model';

/**
 * @public
 * Jest schema for validating Next query entities
 */
export const HistoryQuerySchema: HistoryQuery = {
  modelName: expect.any(String),
  query: expect.any(String),
  timestamp: expect.any(Number)
};
