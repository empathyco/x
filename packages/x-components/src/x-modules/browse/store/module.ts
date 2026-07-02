import type { Stats } from '@empathyco/x-types'
import type { BrowseXStoreModule } from './types'
import { isFacetFilter } from '@empathyco/x-types'
import { DefaultResultsEnrichmentService } from '../../../services/results-enrichment.service'
import { setStatus } from '../../../store'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { groupItemsBy } from '../../../utils/array'
import { UNKNOWN_FACET_KEY } from '../../facets/store/constants'
import {
  cancelFetchAndSaveBrowseResponse,
  fetchAndSaveBrowseResponse,
  fetchAndSaveResultsEnrichment,
  fetchBrowseResponse,
  increasePageAppendingResults,
  resetRequestOnRefinement,
  saveBrowseResponse,
} from './actions'
import { saveOrigin } from './actions/save-origin.action'
import { setUrlParams } from './actions/set-url-params.action'
import { request } from './getters/request.getter'

/**
 * {@link XStoreModule} For the browse module.
 *
 * @internal
 */
export const browseXStoreModule: BrowseXStoreModule = {
  state: () => ({
    ...resettableState(),
    selectedFilters: {},
    params: {},
    config: {
      threshold: 24,
      pageSize: 24,
      pageMode: 'infinite_scroll',
    },
    status: 'initial',
    isNoResults: false,
    fromNoResultsWithFilters: false,
  }),
  getters: {
    request,
  },
  mutations: {
    appendResults(state, results) {
      state.results = [...state.results, ...results]
    },
    resetState(state) {
      Object.assign(state, resettableState())
    },
    resetStateForReload(state) {
      const { selectedCategory, facets, sort, page, ...resettable } = resettableState()
      Object.assign(state, resettable)
    },
    setResults(state, results) {
      state.results = results
    },
    setFacets(state, facets) {
      state.facets = facets
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
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults
    },
    setSort(state, sort) {
      state.sort = sort
    },
    setPage(state, page) {
      state.page = page
    },
    setSelectedCategory(state, selectedCategory) {
      state.selectedCategory = selectedCategory
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
    setBrowseTagging(state, browseTagging) {
      state.browseTagging = browseTagging
    },
    setDisplayBrowseTagging(state, displayBrowseTagging) {
      state.displayBrowseTagging = displayBrowseTagging
    },
    updateResult(state, result) {
      const stateResult = state.results.find(stateResult => result.id === stateResult.id)
      if (stateResult) {
        Object.assign(stateResult, result)
      }
    },
    updateResultsFromEnrichment(state, enrichmentResults) {
      DefaultResultsEnrichmentService.instance.updateResults(state.results, enrichmentResults)
    },
    setStats(state, stats) {
      state.stats = stats
    },
  },
  actions: {
    cancelFetchAndSaveBrowseResponse,
    fetchBrowseResponse,
    fetchAndSaveBrowseResponse,
    fetchAndSaveResultsEnrichment,
    increasePageAppendingResults,
    resetRequestOnRefinement,
    saveBrowseResponse,
    setUrlParams,
    saveOrigin,
  },
}

/**
 * Function to return the "resettable" part of the state. This will be used in the `resetState`
 * mutation to reset to the initial state.
 *
 * @returns The "resettable" part of the {@link BrowseState}.
 *
 * @internal
 */
export function resettableState() {
  return {
    selectedCategory: {
      browseValue: '',
      browseField: '',
    },
    results: [],
    facets: [],
    banners: [],
    promoteds: [],
    totalResults: 0,
    sort: '',
    page: 1,
    origin: null,
    isAppendResults: false,
    browseTagging: {
      url: '',
      params: {},
    },
    displayBrowseTagging: {
      url: '',
      params: {},
    },
    stats: {} as Stats,
  }
}
