import { HistoryQuery } from '../history-query.model';

/**
 * Jest schema for validating Next query entities.
 *
 * @public
 */
export const HistoryQuerySchema: HistoryQuery = {
  modelName: expect.any(String),
  query: expect.any(String),
  timestamp: expect.any(Number)
};
