import type { AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

/**
 * Default implementation for the {@link AiActions.fetchAndSaveAiSuggestionsSearch}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the commits,
 * provided by Vuex.
 * @param request - The AI search request to make.
 * @returns The AI search response.
 * @public
 */
export const fetchAndSaveAiSuggestionsSearch: AiXStoreModule['actions']['fetchAndSaveAiSuggestionsSearch'] =
  async ({ commit }, request) => {
    if (!request) {
      return
    }
    commit('setSuggestionsSearchLoading', true)
    return XPlugin.adapter
      .aiSuggestionsSearch(request)
      .then(response => {
        if (response) {
          commit('setSuggestionsSearch', response.suggestions)
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        commit('setSuggestionsSearchLoading', false)
      })
  }
