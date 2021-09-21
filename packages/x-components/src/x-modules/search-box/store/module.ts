import { setQueryFromUrl } from './actions/set-query-from-url.action';
import { SearchBoxXStoreModule } from './types';

/**
 * {@link XStoreModule} For the search-box module.
 *
 * @internal
 */
export const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({
    query: ''
  }),
  getters: {
    trimmedQuery(state) {
      return state.query.trim();
    }
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    }
  },
  actions: {
    setQueryFromUrl
  }
};
