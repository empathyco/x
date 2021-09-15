import { setStatus } from '../../../store/status.helpers';
import {
  cancelFetchAndSaveSuggestions,
  fetchAndSaveSuggestions
} from './actions/fetch-and-save-suggestions.action';
import { fetchSuggestions } from './actions/fetch-suggestions.action';
import { popularSearches } from './getters/popular-searches.getter';
import { request } from './getters/request.getter';
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
    },
    params: {}
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
