import type { SearchRequest, SearchResponse } from '@empathyco/x-types'
import type { InternalSearchRequest } from '../../types'
import type { SearchActionContext, SearchState } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  InternalSearchRequest | null,
  SearchResponse | null
>({
  async fetch({ dispatch, state }, request) {
    return request
      ? dispatch('fetchSearchResponse', enrichRequest(request, state))
      : Promise.resolve(null)
  },
  onSuccess({ dispatch }, response) {
    if (response !== null) {
      void dispatch('saveSearchResponse', response)
    }
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
