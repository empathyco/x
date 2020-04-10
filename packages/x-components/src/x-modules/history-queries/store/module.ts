import { HistoryQuery } from '@empathy/search-types';
import { addQueryToHistory } from './actions/add-query-to-history.action';
import { refreshSession } from './actions/refresh-session.action';
import { removeQueryFromHistory } from './actions/remove-query-from-history.action';
import { setHistoryQueries } from './actions/set-history-queries.action';
import {
  HISTORY_QUERIES_STORAGE_KEY,
  localStorageService,
  SESSION_TIME_STAMP_STORAGE_KEY
} from './constants';
import { historyQueries } from './getters/history-queries.getter';
import { sessionHistoryQueries } from './getters/session-history-queries.getter';
import { storageKey } from './getters/storage-key.getter';
import { HistoryQueriesXStoreModule } from './types';

/**
 * {@link XStoreModule} For the history-queries module.
 *
 * @internal
 */
export let historyQueriesXStoreModule: HistoryQueriesXStoreModule;
historyQueriesXStoreModule = {
  state() {
    const sessionTTLInMs = 30 * 60 * 1000;
    const historyQueries =
      localStorageService.getItem<HistoryQuery[]>(HISTORY_QUERIES_STORAGE_KEY) ?? [];
    localStorageService.setItem(HISTORY_QUERIES_STORAGE_KEY, historyQueries);
    const sessionTimeStampInMs =
      localStorageService.getItem<number>(SESSION_TIME_STAMP_STORAGE_KEY) ?? Date.now();
    localStorageService.setItem(
      SESSION_TIME_STAMP_STORAGE_KEY,
      sessionTimeStampInMs,
      sessionTTLInMs
    );
    return {
      config: {
        debounceInMs: 150,
        maxItemsToRender: 5,
        maxItemsToStore: 50,
        hideIfEqualsQuery: true,
        sessionTTLInMs // TODO Session related stuff should be extracted from this module
      },
      query: '',
      historyQueries,
      sessionTimeStampInMs // TODO Session related stuff should be extracted from this module
    };
  },
  getters: {
    historyQueries,
    sessionHistoryQueries,
    storageKey
  },
  mutations: {
    setHistoryQueries(state, historyQueries) {
      state.historyQueries = historyQueries;
    },
    setSessionTimeStamp(state, sessionTimeStamp) {
      state.sessionTimeStampInMs = sessionTimeStamp;
    },
    setQuery(state, query) {
      state.query = query;
    }
  },
  actions: {
    addQueryToHistory,
    removeQueryFromHistory,
    setHistoryQueries,
    refreshSession
  }
};
