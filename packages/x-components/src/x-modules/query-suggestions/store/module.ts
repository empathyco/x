import type { QuerySuggestionsXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setQuery } from '../../../store/utils/query.utils'
import { setStatus } from '../../../store/utils/status-store.utils'
import {
  cancelFetchAndSaveSuggestions,
  fetchAndSaveSuggestions,
} from './actions/fetch-and-save-suggestions.action'
import { fetchSuggestions } from './actions/fetch-suggestions.action'
import { setUrlParams } from './actions/set-url-params.action'
import { normalizedQuery } from './getters/normalized-query.getter'
import { querySuggestions } from './getters/query-suggestions.getter'
import { request } from './getters/request.getter'

/**
 * {@link XStoreModule} For the query-suggestions module.
 *
 * @internal
 */
export const querySuggestionsXStoreModule: QuerySuggestionsXStoreModule = {
  state: () => ({
    query: '',
    suggestions: [],
    searchedQueries: [],
    status: 'initial',
    config: {
      debounceInMs: 200,
      maxItemsToRequest: 10,
      hideIfEqualsQuery: true,
      hideSessionQueries: true,
    },
    params: {},
  }),
  getters: {
    request,
    normalizedQuery,
    querySuggestions,
  },
  mutations: {
    setQuery,
    setSuggestions(state, suggestions) {
      state.suggestions = suggestions
    },
    setSearchedQueries(state, searchedQueries) {
      state.searchedQueries = searchedQueries
    },
    setStatus,
    setParams(state, params) {
      state.params = params
    },
    setConfig,
    mergeConfig,
  },
  actions: {
    cancelFetchAndSaveSuggestions,
    fetchSuggestions,
    fetchAndSaveSuggestions,
    setUrlParams,
  },
}
