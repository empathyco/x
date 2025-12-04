import type { FacetsRequest, FacetsResponse } from '@empathyco/x-types'
import type { FacetsActionsContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  FacetsActionsContext,
  FacetsRequest | null,
  FacetsResponse | null
>({
  async fetch({ dispatch }, request) {
    return request ? dispatch('fetchFacetsResponse', request) : Promise.resolve(null)
  },
  onSuccess({ commit }, response) {
    if (response !== null && response.facets) {
      commit('setRawFacets', response.facets)
    }
  },
})

/**
 * Default implementation for {@link FacetsActions.fetchAndSaveFacetsResponse} action.
 *
 * @public
 */
export const fetchAndSaveFacetsResponse = fetchAndSave

/**
 * Default implementation for {@link FacetsActions.cancelFetchAndSaveFacetsResponse} action.
 *
 * @public
 */
export const cancelFetchAndSaveFacetsResponse = cancelPrevious
