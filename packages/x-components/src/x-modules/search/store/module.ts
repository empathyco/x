import { isFacetFilter } from '@empathyco/x-types';
import { setQuery } from '../../../store/utils/query.utils';
import { setStatus } from '../../../store/utils/status-store.utils';
import { groupItemsBy } from '../../../utils/array';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { UNKNOWN_FACET_KEY } from '../../facets/store/constants';
import {
  cancelFetchAndSaveSearchResponse,
  fetchAndSaveSearchResponse
} from './actions/fetch-and-save-search-response.action';
import { fetchSearchResponse } from './actions/fetch-search-response.action';
import { increasePageAppendingResults } from './actions/increase-page-apending-results.action';
import { resetRequestOnRefinement } from './actions/reset-request-on-refinement.action';
import { saveOrigin } from './actions/save-origin.action';
import { saveSearchResponse } from './actions/save-search-response.action';
import { setUrlParams } from './actions/set-url-params.action';
import { query } from './getters/query.getter';
import { request } from './getters/request.getter';
import { SearchXStoreModule } from './types';

/**
 * {@link XStoreModule} For the search module.
 *
 * @internal
 */
export const searchXStoreModule: SearchXStoreModule = {
  state: () => ({
    ...resettableState(),
    selectedFilters: {},
    params: {},
    config: {
      pageSize: 24
    },
    status: 'initial',
    isNoResults: false,
    fromNoResultsWithFilters: false
  }),
  getters: {
    request,
    query
  },
  mutations: {
    appendResults(state, results) {
      state.results.push(...results);
    },
    resetState(state) {
      Object.assign(state, resettableState());
    },
    setQuery,
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
      state.selectedFilters = groupItemsBy(selectedFilters, filter =>
        isFacetFilter(filter) ? filter.facetId : UNKNOWN_FACET_KEY
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
    setConfig,
    mergeConfig,
    setIsAppendResults(state, isAppendResults) {
      state.isAppendResults = isAppendResults;
    },
    setIsNoResults(state, isNoResults) {
      state.isNoResults = isNoResults;
    },
    setFromNoResultsWithFilters(state, fromNoResultsWithFilters) {
      state.fromNoResultsWithFilters = fromNoResultsWithFilters;
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
    },
    updateResult(state, result) {
      const stateResult = state.results.find(stateResult => result.id === stateResult.id);
      if (stateResult) {
        Object.assign(stateResult, result);
      }
    }
  },
  actions: {
    cancelFetchAndSaveSearchResponse,
    fetchSearchResponse,
    fetchAndSaveSearchResponse,
    increasePageAppendingResults,
    resetRequestOnRefinement,
    saveSearchResponse,
    setUrlParams,
    saveOrigin
  }
};

/**
 * Function to return the "resettable" part of the state. This will be used in the `resetState`
 * mutation to reset to the initial state.
 *
 * @returns The "resettable" part of the {@link SearchState}.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function resettableState() {
  return {
    query: '',
    results: [],
    partialResults: [],
    facets: [],
    relatedTags: [],
    banners: [],
    promoteds: [],
    totalResults: 0,
    spellcheckedQuery: '',
    sort: '',
    page: 1,
    origin: null,
    isAppendResults: false,
    redirections: [],
    queryTagging: {
      url: '',
      params: {}
    }
  };
}
