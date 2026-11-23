import type { SearchRequest, SearchResponse } from '@empathyco/x-types'
import type { InternalSearchRequest } from '../../types'
import type { SearchActionContext, SearchState } from '../types'
import { deepEqual } from '@empathyco/x-utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

interface FetchedSearch {
  response: SearchResponse
  /** The request sent to get the response, when it is the one of the `noResultsFallback`. */
  fallbackRequest?: SearchRequest
}

/** The last rescued request and its response, to not repeat it when the state change refetches. */
let lastFallback: { request: SearchRequest; response: SearchResponse } | undefined

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  InternalSearchRequest | null,
  FetchedSearch | null
>({
  async fetch({ dispatch, state }, request) {
    if (!request) {
      return null
    }
    const searchRequest = enrichRequest(request, state)
    if (lastFallback && deepEqual(searchRequest, lastFallback.request)) {
      return { response: lastFallback.response }
    }
    lastFallback = undefined

    const response = await dispatch('fetchSearchResponse', searchRequest)
    const fallback = state.config.noResultsFallback
    const fallbackEntries = Object.entries(fallback ?? {})
    if (
      response.totalResults === 0 &&
      fallbackEntries.some(([key, value]) => searchRequest.extraParams?.[key] !== value)
    ) {
      const fallbackRequest = {
        ...searchRequest,
        extraParams: { ...searchRequest.extraParams, ...fallback },
      }
      const fallbackResponse = await dispatch('fetchSearchResponse', fallbackRequest)
      if (fallbackResponse.totalResults > 0) {
        return { response: fallbackResponse, fallbackRequest }
      }
    }
    return { response }
  },
  onSuccess({ commit, dispatch, rootState, state }, fetched) {
    if (fetched === null) {
      return
    }
    const { response, fallbackRequest } = fetched
    if (fallbackRequest) {
      const catalogSectionParamKey =
        rootState.x?.extraParams?.catalogSectionParamKey ?? 'catalogSection'
      const { [catalogSectionParamKey]: catalogSection, ...extraParams } =
        state.config.noResultsFallback!
      lastFallback = { request: fallbackRequest, response }
      if (catalogSection !== undefined) {
        commit('setCatalogSection', catalogSection)
      }
      if (Object.keys(extraParams).length) {
        commit('setParams', { ...state.params, ...extraParams })
        void XPlugin.bus.emit('ExtraParamsProvided', extraParams)
      }
    }
    void dispatch('saveSearchResponse', response)
  },
})

/**
 * Enriches the {@link SearchRequest} object with the origin and page properties taken from the
 * {@link SearchState | search state}.
 *
 * @param request - The {@link InternalSearchRequest}.
 * @param state - {@link SearchState}.
 *
 * @returns The search request.
 * @internal
 */
function enrichRequest(request: InternalSearchRequest, state: SearchState): SearchRequest {
  const { page, ...restRequest } = request
  const {
    config: { pageSize, pageMode },
    origin,
    results,
  } = state

  let start
  if (pageMode === 'infinite_scroll') {
    start = page === 1 ? 0 : results.length
  } else {
    start = state.config.pageSize * (page - 1)
  }

  const rows = pageMode === 'infinite_scroll' ? pageSize * page - start : pageSize

  return {
    ...restRequest,
    ...(origin && { origin }),
    start,
    rows,
  }
}

/**
 * Default implementation for {@link SearchActions.fetchAndSaveSearchResponse} action.
 *
 * @public
 */
export const fetchAndSaveSearchResponse = fetchAndSave

/**
 * Default implementation for {@link SearchActions.cancelFetchAndSaveSearchResponse} action.
 *
 * @public
 */
export const cancelFetchAndSaveSearchResponse = cancelPrevious
