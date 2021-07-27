import { setStatus } from '../../../store/utils/helpers/status.helpers';
import { groupItemsBy } from '../../../utils/array';
import {
  cancelFetchAndSaveSearchResponse,
  fetchAndSaveSearchResponse
} from './actions/fetch-and-save-search-response.action';
import { fetchSearchResponse } from './actions/fetch-search-response.action';
import { increasePageAppendingResults } from './actions/increase-page-apending-results.action';
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
    page: 1,
    isAppendResults: false
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
    appendResults(state, results) {
      state.results.push(...results);
    },
    appendBanners(state, banners) {
      state.banners.push(...banners);
    },
    appendPromoteds(state, promoteds) {
      state.promoteds.push(...promoteds);
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
    setIsAppendResults(state, isAppendResults) {
      state.isAppendResults = isAppendResults;
    },
    setStatus
  },
  actions: {
    cancelFetchAndSaveSearchResponse,
    fetchSearchResponse,
    fetchAndSaveSearchResponse,
    increasePageAppendingResults
  }
};
