import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
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
      maxItems: 10,
      showExtraSuggestionWithoutFilter: true,
      hideIfEqualsQuery: true
    }
  }),
  getters: {
    request(state) {
      return state.query
        ? {
            query: state.query,
            rows: state.config.maxItems,
            start: 0
          }
        : null;
    }
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
