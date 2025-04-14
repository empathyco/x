import type { HistoryQueriesXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setQuery } from '../../../store/utils/query.utils'
import { localStorageService } from '../../../utils/storage'
import { addQueryToHistory } from './actions/add-query-to-history.action'

import { loadHistoryQueriesFromBrowserStorage } from './actions/load-history-queries-from-browser-storage.action'
import { refreshSession } from './actions/refresh-session.action'
import { removeFromHistory } from './actions/remove-query-from-history.action'
import { setHistoryQueries } from './actions/set-history-queries.action'
import { setUrlParams } from './actions/set-url-params.action'
import { toggleHistoryQueries } from './actions/toggle-history-queries.action'

import { updateHistoryQueriesWithSearchResponse } from './actions/update-history-queries-with-search-response.action'
import { HISTORY_QUERIES_ENABLED_KEY } from './constants'
import { historyQueriesWithResults } from './getters/history-queries-with-results.getter'
import { historyQueries } from './getters/history-queries.getter'
import { normalizedQuery } from './getters/normalized-query.getter'
import { sessionHistoryQueries } from './getters/session-history-queries.getter'
import { storageKey } from './getters/storage-key.getter'

/**
 * {@link XStoreModule} For the history-queries module.
 *
 * @internal
 */
export const historyQueriesXStoreModule: HistoryQueriesXStoreModule = {
  state: () => ({
    config: {
      debounceInMs: 150,
      maxItemsToStore: 50,
      hideIfEqualsQuery: true,
      sessionTTLInMs: 30 * 60 * 1000,
    },
    query: '',
    historyQueries: [],
    sessionTimeStampInMs: Date.now(),
    isEnabled: localStorageService.getItem<boolean>(HISTORY_QUERIES_ENABLED_KEY) ?? true,
  }),
  getters: {
    historyQueries,
    normalizedQuery,
    historyQueriesWithResults,
    sessionHistoryQueries,
    storageKey,
  },
  mutations: {
    setHistoryQueries(state, historyQueries) {
      state.historyQueries = historyQueries
    },
    setSessionTimeStamp(state, sessionTimeStamp) {
      state.sessionTimeStampInMs = sessionTimeStamp
    },
    setQuery,
    setConfig,
    mergeConfig,
    setIsEnabled(state, isEnabled) {
      state.isEnabled = isEnabled
    },
    setSearchSelectedFilters(state, filters) {
      state.historyQueries[0].selectedFilters = filters
    },
  },
  actions: {
    addQueryToHistory,
    loadHistoryQueriesFromBrowserStorage,
    refreshSession,
    removeFromHistory,
    setHistoryQueries,
    setUrlParams,
    toggleHistoryQueries,
    updateHistoryQueriesWithSearchResponse,
  },
}
