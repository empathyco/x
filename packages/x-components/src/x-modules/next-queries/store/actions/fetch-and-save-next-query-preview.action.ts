import type { NextQueriesXStoreModule } from '../types'

export const fetchAndSaveNextQueryPreview: NextQueriesXStoreModule['actions']['fetchAndSaveNextQueryPreview'] =
  async ({ dispatch, commit }, { query, location }) => {
    return dispatch('fetchNextQueryPreview', { query, location })
      .then(response => {
        if (response) {
          commit('setResultsPreview', {
            [query]: {
              query,
              totalResults: response.totalResults,
              items: response.results,
            },
          })
        }
      })
      .catch(error => {
        console.error(error)
      })
  }
