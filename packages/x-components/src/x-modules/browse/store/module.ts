import type { BrowseXStoreModule, ReseteableBrowseState } from './types'
import { setStatus } from '../../../store/utils/status-store.utils'
import { browseAndSave, cancelBrowse } from './actions/browse-and-save.action'
import { browse } from './actions/browse.action'
import { increasePage } from './actions/increase-page.action'
import { setUrlParams } from './actions/set-url-params'
import { browseRequest } from './getters/browse-request.getter'

/**
 * {@link XStoreModule} For the browse module.
 *
 * @internal
 */
export const browseXStoreModule: BrowseXStoreModule = {
  state: () => ({
    ...resettableBrowseState(),
    shouldAppendResults: false,
    config: {
      pageSize: 45,
    },
    params: {},
    status: 'initial',
  }),
  getters: {
    browseRequest,
  },
  mutations: {
    updateResult(state, result) {
      const stateResult = state.results.find(stateResult => result.id === stateResult.id)
      if (stateResult) {
        Object.assign(stateResult, result)
      }
    },
    setBrowse(state, browse) {
      state.selectedCategory = browse.browseCategory
    },
    setSelectedCategory(state, selectedCategory) {
      state.selectedCategory = selectedCategory
    },
    setResults(state, results) {
      state.results = results
    },
    setFacets(state, facets) {
      state.facets = facets
    },
    setPage(state, page) {
      state.page = page
    },
    setPageSize(state, pageSize) {
      state.config.pageSize = pageSize
    },
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults
    },
    setSort(state, sort) {
      state.sort = sort
    },
    setSelectedFilters(state, selectedFilters) {
      state.selectedFilters = selectedFilters
    },
    setBrowseTagging(state, browseTagging) {
      state.browseTagging = browseTagging
    },
    setDisplayTagging(state, displayTagging) {
      state.displayTagging = displayTagging
    },
    setIsNoResults(state, isNoResults) {
      state.isNoResults = isNoResults
    },
    setShouldAppendResults(state, shouldAppendResults) {
      state.shouldAppendResults = shouldAppendResults
    },
    setParams(state, params) {
      state.params = params
    },
    resetState(state) {
      Object.assign(state, resettableBrowseState())
    },
    setStatus,
  },
  actions: {
    browse,
    browseAndSave,
    cancelBrowse,
    increasePage,
    setUrlParams,
  },
}

/**
 * Function to return the "resettable" part of the state. This will be used in the `resetState`
 * mutation to reset to the initial state.
 *
 * @returns The "resettable" part of the Browse state.
 * @internal
 */
export function resettableBrowseState(): ReseteableBrowseState {
  return {
    selectedCategory: '',
    results: [],
    facets: [],
    page: 1,
    totalResults: 0,
    sort: '',
    selectedFilters: [],
    isNoResults: false,
    browseTagging: {
      url: '',
      params: {},
    },
    displayTagging: {
      url: '',
      params: {},
    },
  }
}
