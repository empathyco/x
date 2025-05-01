import type { QuerySuggestionsRequest, Suggestion } from '@empathyco/x-types'

import type { QuerySuggestionsActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  QuerySuggestionsActionContext,
  QuerySuggestionsRequest | null,
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
 * Default implementation for {@link QuerySuggestionsActions.fetchAndSaveSuggestions} action.
 *
 * @public
 */
export const fetchAndSaveSuggestions = fetchAndSave

/**
 * Default implementation for {@link QuerySuggestionsActions.cancelFetchAndSaveSuggestions} action.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestions = cancelPrevious
