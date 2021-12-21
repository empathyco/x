import { isFacetFilter } from '@empathyco/x-types';
import { setStatus } from '../../../store/utils/status-store.utils';
import { groupItemsBy } from '../../../utils/array';
import {
  cancelFetchAndSaveSearchResponse,
  fetchAndSaveSearchResponse
} from './actions/fetch-and-save-search-response.action';
import { fetchSearchResponse } from './actions/fetch-search-response.action';
import { increasePageAppendingResults } from './actions/increase-page-apending-results.action';
import { saveOrigin } from './actions/save-origin.action';
import { setUrlParams } from './actions/set-url-params.action';
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
    params: {},
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
    status: 'initial',
    sort: '',
    page: 1,
    origin: null,
    isAppendResults: false,
    redirections: [],
    queryTagging: {
      url: '',
      params: {}
    }
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
      state.selectedFilters = groupItemsBy(selectedFilters, filter =>
        isFacetFilter(filter) ? filter.facetId : '__unknown__'
      );
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
    setStatus,
    setParams(state, params) {
      state.params = params;
    },
    setOrigin(state, origin = null) {
      state.origin = origin;
    },
    setRedirections(state, redirections) {
      state.redirections = redirections;
    },
    setQueryTagging(state, queryTagging) {
      state.queryTagging = queryTagging;
    }
  },
  actions: {
    cancelFetchAndSaveSearchResponse,
    fetchSearchResponse,
    fetchAndSaveSearchResponse,
    increasePageAppendingResults,
    setUrlParams,
    saveOrigin
  }
};
