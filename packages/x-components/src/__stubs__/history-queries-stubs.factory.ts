import { HistoryQuery } from '@empathyco/x-types';
import { deepMerge } from '@empathyco/x-deep-merge';
import { DeepPartial } from '../utils/types';

/**
 * Creates a history query overriding default values with the ones passed.
 *
 * @param historyQuery - Partial history query to override default values.
 * @returns A new history query with the values provided.
 *
 * @internal
 */
export function createHistoryQuery(historyQuery: DeepPartial<HistoryQuery>): HistoryQuery {
  const defaults: HistoryQuery = {
    modelName: 'HistoryQuery',
    timestamp: Date.now(),
    query: ''
  };
  return deepMerge(defaults, historyQuery);
}

/**
 * Creates an array of history queries for the given set of queries.
 *
 * @param queries - The queries for creating the history queries.
 * @returns An array containing a list of HistoryQueries.
 *
 * @internal
 */
export function createHistoryQueries(...queries: string[]): HistoryQuery[] {
  return queries.map(query => createHistoryQuery({ query }));
}
