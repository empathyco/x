import { HistoryQuery } from '@empathy/search-types';
import { deepMerge } from '@empathybroker/deep-merge';
import { Store } from 'vuex';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { historyQueriesXStoreModule } from '../module';
import { HistoryQueriesState } from '../types';

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

/**
 * Reset history queries module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - History queries store state.
 * @param state - Partial history queries store state to be replaced.
 *
 * @internal
 */
export function resetHistoryQueriesStateWith(
  store: Store<HistoryQueriesState>,
  state?: DeepPartial<HistoryQueriesState>
): void {
  resetStoreModuleState<HistoryQueriesState>(store, historyQueriesXStoreModule.state(), state);
}
