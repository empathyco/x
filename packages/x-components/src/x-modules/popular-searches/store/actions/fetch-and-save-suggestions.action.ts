import type { PopularSearchesRequest, Suggestion } from '@empathyco/x-types'

import type { PopularSearchesActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  PopularSearchesActionContext,
  PopularSearchesRequest,
  Suggestion[]
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchSuggestions', request)
  },
  onSuccess({ commit }, suggestions) {
    commit('setSuggestions', suggestions)
  },
})

/**
 * Default implementation for {@link PopularSearchesActions.fetchAndSaveSuggestions} action.
 *
 * @public
 */
export const fetchAndSaveSuggestions = fetchAndSave

/**
 * Default implementation for {@link PopularSearchesActions.cancelFetchAndSaveSuggestions} action.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestions = cancelPrevious
