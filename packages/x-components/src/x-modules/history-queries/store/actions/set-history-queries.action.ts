import { localStorageService } from '../../../../utils/storage';
import { HISTORY_QUERIES_STORAGE_KEY } from '../constants';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesActions.setHistoryQueries}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param historyQueries - The new history queries to save to the store and browser storage.
 * @public
 */
export const setHistoryQueries: HistoryQueriesXStoreModule['actions']['setHistoryQueries'] = (
  { commit, state },
  historyQueries
) => {
  if (historyQueries.length > state.config.maxItemsToStore) {
    historyQueries = historyQueries.slice(0, state.config.maxItemsToStore);
  }
  commit('setHistoryQueries', historyQueries);
  localStorageService.setItem(HISTORY_QUERIES_STORAGE_KEY, historyQueries);
};
