import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { TermSuggestionsXStoreModule } from './types';

const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .build(); // TODO It should be injected

/**
 * {@link XStoreModule} For the term-suggestions module.
 *
 * @internal
 */
export const termSuggestionsXStoreModule: TermSuggestionsXStoreModule = {
  state: () => ({
    query: '',
    suggestions: [],
    config: {
      size: 5
    }
  }),
  getters: {
    request(state) {
      return state.query
        ? {
            query: state.query,
            rows: state.config.size,
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
