import type { QuerySuggestionsRequest, Suggestion } from '@empathyco/x-types'

import type { QuerySuggestionsActionContext, QuerySuggestionsXStoreModule } from '../types'
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
 * It stores the request as the last fetched one so consumers can know that it has already been
 * launched, and avoid launching it again until a different request arrives.
 *
 * @public
 */
export const fetchAndSaveSuggestions: QuerySuggestionsXStoreModule['actions']['fetchAndSaveSuggestions'] =
  async (context, request) => {
    context.commit('setLastRequest', request)
    return fetchAndSave(context, request)
  }

/**
 * Default implementation for {@link QuerySuggestionsActions.cancelFetchAndSaveSuggestions} action.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestions = cancelPrevious
