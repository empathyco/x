import type { AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

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
