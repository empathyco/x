import { setStatus } from '../../../store/utils/status-store.utils';
import { setConfig } from '../../../store/utils/config-store.utils';
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
    status: 'initial',
    config: {
      hideSessionQueries: true,
      maxItemsToRequest: 20
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
    },
    setConfig
  },
  actions: {
    cancelFetchAndSaveSuggestions,
    fetchSuggestions,
    fetchAndSaveSuggestions
  }
};
