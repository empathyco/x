import { setStatus } from '../../../store/utils/helpers/status.helpers';
import { groupItemsBy } from '../../../utils/array';
import {
  cancelFetchAndSaveSearchResponse,
  fetchAndSaveSearchResponse
} from './actions/fetch-and-save-search-response.action';
import { fetchSearchResponse } from './actions/fetch-search-response.action';
import { request } from './getters/request';
import { results } from './getters/results';
import { SearchXStoreModule } from './types';

/**
 * {@link XStoreModule} For the search module.
 *
 * @internal
 */
export const searchXStoreModule: SearchXStoreModule = {
  state: () => ({
    query: '',
    results: [],
    facets: [],
    relatedTags: [],
    selectedFilters: {},
    config: {
      maxItemsToRequest: 24
    },
    status: 'success'
  }),
  getters: {
    request,
    results
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setResults(state, results) {
      state.results = results;
    },
    setFacets(state, facets) {
      state.facets = facets;
    },
    setRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags;
    },
    setSelectedFilters(state, selectedFilters) {
      state.selectedFilters = groupItemsBy(selectedFilters, filter => filter.facetId);
    },
    setStatus
  },
  actions: {
    cancelFetchAndSaveSearchResponse,
    fetchSearchResponse,
    fetchAndSaveSearchResponse
  }
};
