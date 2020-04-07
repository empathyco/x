import { historyQueries } from './getters/history-queries.getter';
import { sessionHistoryQueries } from './getters/session-history-queries.getter';
import { storageKey } from './getters/storage-key.getter';
import { HistoryQueriesXStoreModule } from './types';

/**
 * {@link XStoreModule} For the history-queries module.
 *
 * @internal
 */
export const historyQueriesXStoreModule: HistoryQueriesXStoreModule = {
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
    sessionTimeStampInMs: 0
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
    addQueryToHistory() {
      // TODO Implement logic
    },
    removeQueryFromHistory() {
      // TODO Implement logic
    },
    setHistoryQueries() {
      // TODO Implement logic
    }
  }
};
