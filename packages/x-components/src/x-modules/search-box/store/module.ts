import { SearchBoxXStoreModule } from './types';

export const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({ query: '' }),
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
  actions: {}
};
