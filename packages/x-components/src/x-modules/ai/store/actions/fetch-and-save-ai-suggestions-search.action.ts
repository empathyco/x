import type { AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'
import { isAbortError } from '../utils'

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
    commit('setSuggestionsSearchStatus', 'loading')

    return XPlugin.adapter
      .aiSuggestionsSearch(request)
      .then(response => {
        if (response) {
          commit('setSuggestionsSearch', response.suggestions)
          commit('setSuggestionsSearchTagging', response.suggestionsTagging)
        }
        commit('setSuggestionsSearchStatus', 'success')
      })
      .catch(error => {
        // A newer request with the same id aborted this one, so it is in charge of the status.
        if (isAbortError(error)) {
          return
        }
        commit('setSuggestionsSearchStatus', 'error')
        console.error(error)
      })
  }
