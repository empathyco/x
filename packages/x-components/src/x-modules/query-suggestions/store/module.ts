import { setStatus } from '../../../store/utils/helpers/status.helpers';
import {
  cancelFetchAndSaveSuggestions,
  fetchAndSaveSuggestions
} from './actions/fetch-and-save-suggestions.action';
import { fetchSuggestions } from './actions/fetch-suggestions.action';
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
    status: 'success',
    config: {
      debounceInMs: 200,
      maxItemsToRequest: 10,
      showExtraSuggestionWithoutFilter: true,
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
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setSuggestions(state, suggestions) {
      state.suggestions = suggestions;
    },
    setStatus,
    setParams(state, params) {
      state.params = params;
    }
  },
  actions: {
    cancelFetchAndSaveSuggestions,
    fetchSuggestions,
    fetchAndSaveSuggestions
  }
};
