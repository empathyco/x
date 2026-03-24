import type { AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

/**
 * Default implementation for the `AiActions.fetchAndSaveAiSuggestionsSearch`.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the commits and
 * getters provided by Vuex.
 * @returns The AI search response.
 * @public
 */
export const fetchAndSaveAiSuggestionsSearch: AiXStoreModule['actions']['fetchAndSaveAiSuggestionsSearch'] =
  async ({ commit, getters }) => {
    const request = getters.suggestionsSearchRequest
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
