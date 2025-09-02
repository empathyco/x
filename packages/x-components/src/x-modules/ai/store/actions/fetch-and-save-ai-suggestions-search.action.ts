import type { AiXStoreModule } from '../types'

export const fetchAndSaveAiSuggestionsSearch: AiXStoreModule['actions']['fetchAndSaveAiSuggestionsSearch'] =
  async ({ dispatch, commit }, request) => {
    return dispatch('fetchAiSuggestionsSearch', request)
      .then(response => {
        if (response) {
          commit('setSuggestionsSearch', response.suggestions)
        }
      })
      .catch(error => {
        console.error(error)
      })
  }
