import { setStatus } from '../../../store/utils/helpers/status.helpers';
import { groupItemsBy } from '../../../utils/array';
import {
  cancelFetchAndSaveSearchResponse,
  fetchAndSaveSearchResponse
} from './actions/fetch-and-save-search-response.action';
import { fetchSearchResponse } from './actions/fetch-search-response.action';
import { setPage } from './actions/set-page';
import { request } from './getters/request.getter';
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
    partialResults: [],
    facets: [],
    relatedTags: [],
    banners: [],
    promoteds: [],
    selectedFilters: {},
    config: {
      pageSize: 24
    },
    totalResults: 0,
    spellcheckedQuery: '',
    status: 'success',
    sort: '',
    page: 1
  }),
  getters: {
    request
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setResults(state, results) {
      state.results = results;
    },
    setPartialResults(state, partialResults) {
      state.partialResults = partialResults;
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
    setBanners(state, banners) {
      state.banners = banners;
    },
    setPromoteds(state, promoteds) {
      state.promoteds = promoteds;
    },
    setSpellcheck(state, spellcheckedQuery) {
      state.spellcheckedQuery = spellcheckedQuery;
    },
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults;
    },
    setSort(state, sort) {
      state.sort = sort;
    },
    setPage(state, page) {
      state.page = page;
    },
    setPageSize(state, pageSize) {
      state.config.pageSize = pageSize;
    },
    setStatus
  },
  actions: {
    cancelFetchAndSaveSearchResponse,
    fetchSearchResponse,
    fetchAndSaveSearchResponse,
    setPage
  }
};
