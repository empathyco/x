import {
  cancelGetAndSaveSuggestions,
  getAndSaveSuggestions
} from './actions/get-and-save-suggestions.action';
import { getSuggestions } from './actions/get-suggestions.action';
import { normalizedQuery } from './getters/normalized-query';
import { querySuggestions } from './getters/query-suggestions.getter';
import { request } from './getters/request';
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
    config: {
      debounceInMs: 200,
      maxItemsToRequest: 10,
      showExtraSuggestionWithoutFilter: true,
      hideIfEqualsQuery: true
    }
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
    }
  },
  actions: {
    cancelGetAndSaveSuggestions,
    getAndSaveSuggestions,
    getSuggestions
  }
};
