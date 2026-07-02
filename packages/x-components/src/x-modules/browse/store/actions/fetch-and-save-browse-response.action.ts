import type { BrowseRequest, BrowseResponse } from '@empathyco/x-types'
import type { InternalBrowseRequest } from '../../types'
import type { BrowseActionContext, BrowseState } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  BrowseActionContext,
  InternalBrowseRequest | null,
  BrowseResponse | null
>({
  async fetch({ dispatch, state }, request) {
    return request && request.browseField !== '' && request.browseValue !== ''
      ? dispatch('fetchBrowseResponse', enrichRequest(request, state))
      : Promise.resolve(null)
  },
  onSuccess({ dispatch }, response) {
    if (response !== null) {
      void dispatch('saveBrowseResponse', response)
    }
  },
})

/**
 * Enriches the {@link BrowseRequest} object with the origin and page properties taken from the
 * {@link BrowseState | browse state}.
 *
 * @param request - The {@link InternalBrowseRequest}.
 * @param state - {@link BrowseState}.
 *
 * @returns The browse request.
 * @internal
 */
function enrichRequest(request: InternalBrowseRequest, state: BrowseState): BrowseRequest {
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
 * Default implementation for {@link BrowseActions.fetchAndSaveBrowseResponse} action.
 *
 * @public
 */
export const fetchAndSaveBrowseResponse = fetchAndSave

/**
 * Default implementation for {@link BrowseActions.cancelFetchAndSaveBrowseResponse} action.
 *
 * @public
 */
export const cancelFetchAndSaveBrowseResponse = cancelPrevious
