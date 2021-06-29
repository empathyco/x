import { HistoryQuery } from '@empathy/search-types';
import { localStorageService } from '../../../../utils/storage';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the
 * {@link HistoryQueriesActions.loadHistoryQueriesFromBrowserStorage} action.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @public
 */
// eslint-disable-next-line max-len
export const loadHistoryQueriesFromBrowserStorage: HistoryQueriesXStoreModule['actions']['loadHistoryQueriesFromBrowserStorage'] =
  ({ commit, getters }) => {
    const historyQueries = localStorageService.getItem<HistoryQuery[]>(getters.storageKey) ?? [];
    commit('setHistoryQueries', historyQueries);
  };
