import { addQueryToHistory } from './actions/add-query-to-history.action';
// eslint-disable-next-line max-len
import { loadHistoryQueriesFromBrowserStorage } from './actions/load-history-queries-from-browser-storage.action';
import { refreshSession } from './actions/refresh-session.action';
import { removeQueryFromHistory } from './actions/remove-query-from-history.action';
import { setHistoryQueries } from './actions/set-history-queries.action';
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
  state: () => ({
    config: {
      debounceInMs: 150,
      maxItemsToRender: 5,
      maxItemsToStore: 50,
      hideIfEqualsQuery: true,
      sessionTTLInMs: 30 * 60 * 1000
    },
    query: '',
    historyQueries: [],
    sessionTimeStampInMs: Date.now()
  }),
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
    loadHistoryQueriesFromBrowserStorage,
    refreshSession,
    removeQueryFromHistory,
    setHistoryQueries
  }
};
