import { setQuery } from '../../../store/utils/query.utils';
import { setStatus } from '../../../store/utils/status-store.utils';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import {
  cancelFetchAndSaveSuggestions,
  fetchAndSaveSuggestions
} from './actions/fetch-and-save-suggestions.action';
import { fetchSuggestions } from './actions/fetch-suggestions.action';
import { setUrlParams } from './actions/set-url-params.action';
import { normalizedQuery } from './getters/normalized-query.getter';
import { querySuggestions } from './getters/query-suggestions.getter';
import { request } from './getters/request.getter';
import { QuerySuggestionsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the query-suggestions module.
 *
 * @internal
 */
export const querySuggestionsXStoreModule: QuerySuggestionsXStoreModule = {
  state: () => ({
    query: '',
    suggestions: [],
    status: 'initial',
    config: {
      debounceInMs: 200,
      maxItemsToRequest: 10,
      hideIfEqualsQuery: true
    },
    params: {}
  }),
  getters: {
    request,
    normalizedQuery,
    querySuggestions
  },
  mutations: {
    setQuery,
    setSuggestions(state, suggestions) {
      state.suggestions = suggestions;
    },
    setStatus,
    setParams(state, params) {
      state.params = params;
    },
    setConfig,
    mergeConfig
  },
  actions: {
    cancelFetchAndSaveSuggestions,
    fetchSuggestions,
    fetchAndSaveSuggestions,
    setUrlParams
  }
};
