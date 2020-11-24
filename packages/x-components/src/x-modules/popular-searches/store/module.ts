import { setStatus } from '../../../store/utils/helpers/status.helpers';
import { getAndSaveSuggestions } from './actions/get-and-save-suggestions.action';
import { getSuggestions } from './actions/get-suggestions.action';
import { popularSearches } from './getters/popular-searches';
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
    searchedQueries: [],
    status: 'success',
    config: {
      hideSessionQueries: true,
      maxItemsToRequest: 20,
      showExtraSuggestionWithoutFilter: false
    }
  }),
  getters: {
    request,
    popularSearches
  },
  mutations: {
    setSuggestions(state, suggestions) {
      state.popularSearches = suggestions;
    },
    setSearchedQueries(state, searchedQueries) {
      state.searchedQueries = searchedQueries;
    },
    setStatus
  },
  actions: {
    getSuggestions,
    getAndSaveSuggestions
  }
};
