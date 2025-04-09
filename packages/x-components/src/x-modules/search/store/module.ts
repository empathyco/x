import type { Stats } from '@empathyco/x-types'
import type { SearchXStoreModule } from './types'
import { isFacetFilter } from '@empathyco/x-types'
import { setStatus } from '../../../store'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setQuery } from '../../../store/utils/query.utils'
import { groupItemsBy } from '../../../utils/array'
import { UNKNOWN_FACET_KEY } from '../../facets/store/constants'
import {
  cancelFetchAndSaveSearchResponse,
  fetchAndSaveSearchResponse,
  fetchSearchResponse,
  increasePageAppendingResults,
  resetRequestOnRefinement,
  saveSearchResponse,
} from './actions'
import { saveOrigin } from './actions/save-origin.action'
import { setUrlParams } from './actions/set-url-params.action'
import { query } from './getters/query.getter'
import { request } from './getters/request.getter'

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
      pageSize: 24,
      pageMode: 'infinite_scroll',
    },
    status: 'initial',
    isNoResults: false,
    fromNoResultsWithFilters: false,
  }),
  getters: {
    request,
    query,
  },
  mutations: {
    appendResults(state, results) {
      state.results = [...state.results, ...results]
    },
    resetState(state) {
      Object.assign(state, resettableState())
    },
    resetStateForReload(state) {
      const { query, facets, sort, page, ...resettable } = resettableState()
      Object.assign(state, resettable)
    },
    setQuery,
    setResults(state, results) {
      state.results = results
    },
    setPartialResults(state, partialResults) {
      state.partialResults = partialResults
    },
    setFacets(state, facets) {
      state.facets = facets
    },
    setRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags
    },
    setSelectedFilters(state, selectedFilters) {
      state.selectedFilters = groupItemsBy(selectedFilters, filter =>
        isFacetFilter(filter) ? filter.facetId : UNKNOWN_FACET_KEY,
      )
    },
    setBanners(state, banners) {
      state.banners = banners
    },
    setPromoteds(state, promoteds) {
      state.promoteds = promoteds
    },
    setSpellcheck(state, spellcheckedQuery) {
      state.spellcheckedQuery = spellcheckedQuery
    },
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults
    },
    setSort(state, sort) {
      state.sort = sort
    },
    setPage(state, page) {
      state.page = page
    },
    setConfig,
    mergeConfig,
    setIsAppendResults(state, isAppendResults) {
      state.isAppendResults = isAppendResults
    },
    setIsNoResults(state, isNoResults) {
      state.isNoResults = isNoResults
    },
    setFromNoResultsWithFilters(state, fromNoResultsWithFilters) {
      state.fromNoResultsWithFilters = fromNoResultsWithFilters
    },
    setStatus,
    setParams(state, params) {
      state.params = params
    },
    setOrigin(state, origin = null) {
      state.origin = origin
    },
    setRedirections(state, redirections) {
      state.redirections = redirections
    },
    setQueryTagging(state, queryTagging) {
      state.queryTagging = queryTagging
    },
    setDisplayTagging(state, displayTagging) {
      state.displayTagging = displayTagging
    },
    updateResult(state, result) {
      const stateResult = state.results.find(stateResult => result.id === stateResult.id)
      if (stateResult) {
        Object.assign(stateResult, result)
      }
    },
    setStats(state, stats) {
      state.stats = stats
    },
  },
  actions: {
    cancelFetchAndSaveSearchResponse,
    fetchSearchResponse,
    fetchAndSaveSearchResponse,
    increasePageAppendingResults,
    resetRequestOnRefinement,
    saveSearchResponse,
    setUrlParams,
    saveOrigin,
  },
}

/**
 * Function to return the "resettable" part of the state. This will be used in the `resetState`
 * mutation to reset to the initial state.
 *
 * @returns The "resettable" part of the {@link SearchState}.
 *
 * @internal
 */
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
      params: {},
    },
    displayTagging: {
      url: '',
      params: {},
    },
    stats: {} as Stats,
  }
}
