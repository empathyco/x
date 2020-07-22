import { NoSuggestionsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the no-suggestions module.
 *
 * @internal
 */
export const noSuggestionsXStoreModule: NoSuggestionsXStoreModule = {
  state: () => ({
    query: ''
  }),
  getters: {},
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    }
  },
  actions: {}
};
