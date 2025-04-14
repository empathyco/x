import type { SemanticQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link SemanticQueriesActions.fetchAndSaveSemanticQuery}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The semantic query request to make.
 * @returns A Promise of a SemanticQueriesResponse when it fetches the queries.
 *
 * @public
 */

export const fetchAndSaveSemanticQuery: SemanticQueriesXStoreModule['actions']['fetchAndSaveSemanticQuery'] =
  async ({ dispatch, commit }, request) => {
    return dispatch('fetchSemanticQuery', request)
      .then(response => {
        commit('setSemanticQueries', response?.semanticQueries ?? [])
      })
      .catch(error => {
        console.error(error)
      })
  }
