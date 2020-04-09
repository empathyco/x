import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { normalizedQuery } from './getters/normalized-query';
import { request } from './getters/request';
import { QuerySuggestionsXStoreModule } from './types';

const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .build(); // TODO It should be injected

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
    normalizedQuery
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
    retrieveSuggestions({ dispatch, commit }) {
      dispatch('getSuggestions').then(suggestions => commit('setSuggestions', suggestions));
    },
    getSuggestions({ getters }) {
      return getters.request
        ? adapter.getSuggestions(getters.request).then(({ suggestions }) => suggestions)
        : [];
    }
  }
};
