import type { SearchRequest, SearchResponse } from '@empathyco/x-types'
import type { SearchConfig } from '../../config.types'
import type { InternalSearchRequest } from '../../types'
import type { SearchActionContext, SearchState } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

interface FetchedSearch {
  response: SearchResponse
  /** The `noResultsFallback` to apply instead of saving the response, if it is needed. */
  fallback?: NonNullable<SearchConfig['noResultsFallback']>
}

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  InternalSearchRequest | null,
  FetchedSearch | null
>({
  async fetch({ commit, dispatch, state }, request) {
    if (!request) {
      return null
    }
    const isNoResultsFallback = state.isNoResultsFallback
    const fallback = state.config.noResultsFallback

    // The flag is cleared when the next request starts, not when it ends, so a new query that
    // cancels the one of the fallback does not inherit it.
    commit('setIsNoResultsFallback', false)

    const response = await dispatch('fetchSearchResponse', enrichRequest(request, state))

    const shouldApplyFallback =
      !isNoResultsFallback && response.totalResults === 0 && needsFallback(fallback, state)

    return shouldApplyFallback ? { response, fallback } : { response }
  },
  onSuccess({ commit, dispatch }, payload) {
    if (payload === null) {
      return
    }

    const { response, fallback } = payload
    if (!fallback) {
      void dispatch('saveSearchResponse', response)
      return
    }

    // The response without results is not saved. Changing the state makes the request change,
    // which searches again with the fallback values.

    // Marks the next request as the fallback one, so it is not applied twice.
    commit('setIsNoResultsFallback', true)

    // Both changes end in a single new request: the `Provided` suffix gives the event priority in
    // the bus, so the extra params are stored before the request watcher runs, and it sees both.
    if (fallback.extraParams) {
      void XPlugin.bus.emit('NoResultsFallbackExtraParamsProvided', fallback.extraParams)
    }
    if (fallback.catalogSection !== undefined) {
      commit('setCatalogSection', fallback.catalogSection)
    }

    // The status stays as `loading`: the new request resolves it, so no event is emitted with
    // the state of the response that was not saved.
    return false
  },
})

/**
 * Checks if the `noResultsFallback` values still need to be applied. They are only needed if the
 * search does not have them already, otherwise they would be applied again on every search without
 * results.
 *
 * @param fallback - The configured `noResultsFallback`, if any.
 * @param state - {@link SearchState}.
 *
 * @returns True if there is a fallback whose values are not in the state yet.
 * @internal
 */
function needsFallback(
  fallback: SearchConfig['noResultsFallback'],
  state: SearchState,
): fallback is NonNullable<SearchConfig['noResultsFallback']> {
  if (!fallback) {
    return false
  }
  const isSectionPending =
    fallback.catalogSection !== undefined && state.catalogSection !== fallback.catalogSection
  const areParamsPending = Object.entries(fallback.extraParams ?? {}).some(
    ([key, value]) => state.params[key] !== value,
  )
  return isSectionPending || areParamsPending
}

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
