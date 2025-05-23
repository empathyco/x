import type { HistoryQuery } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import { deepMerge } from '@empathyco/x-deep-merge'

/**
 * Creates a history query overriding default values with the ones passed.
 *
 * @param historyQuery - Partial history query to override default values.
 * @returns A new history query with the values provided.
 *
 * @internal
 */
export function createHistoryQuery(historyQuery: DeepPartial<HistoryQuery>) {
  const defaults: HistoryQuery = {
    modelName: 'HistoryQuery',
    timestamp: Date.now(),
    query: '',
  }
  return deepMerge(defaults, historyQuery) as HistoryQuery
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
  return queries.map(query => createHistoryQuery({ query }))
}
