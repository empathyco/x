import { getAndSaveSuggestions } from './actions/get-and-save-suggestions.action';
import { getSuggestions } from './actions/get-suggestions.action';
import { request } from './getters/request';
import { PopularSearchesXStoreModule } from './types';

/**
 * {@link XStoreModule} For the next-queries module.
 *
 * @internal
 */
export const popularSearchesXStoreModule: PopularSearchesXStoreModule = {
  state: () => ({
    popularSearches: [],
    config: {
      maxItemsToRender: 5,
      showExtraSuggestionWithoutFilter: false
    }
  }),
  getters: {
    request
  },
  mutations: {
    setSuggestions(state, suggestions) {
      state.popularSearches = suggestions;
    }
  },
  actions: {
    getSuggestions,
    getAndSaveSuggestions
  }
};
