import type { AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

/**
 * Default implementation for the {@link AiActions.fetchAiSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The request.
 * @returns The AI response.
 *
 * @public
 */
export const fetchAiSuggestionsSearch: AiXStoreModule['actions']['fetchAiSuggestionsSearch'] =
  async ({ commit }, request) => {
    if (!request || !request.queries.length) {
      return null
    }
    commit('setSuggestionsSearchLoading', true)
    return XPlugin.adapter.aiSuggestionsSearch(request).finally(() => {
      commit('setSuggestionsSearchLoading', false)
    })
  }
