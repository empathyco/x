import { SemanticQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link SemanticQueriesActions.fetchAndSaveSemanticQuery}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The semantic query request to make.
 * @returns A Promise of a SearchResponse when it fetches the results.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const fetchAndSaveSemanticQuery: SemanticQueriesXStoreModule['actions']['fetchAndSaveSemanticQuery'] =
  ({ dispatch, commit }, request) => {
    const { query } = request;
    if (!query) {
      return;
    }
    commit('setSemanticQuery', {
      request,
      results: [],
      status: 'loading',
      totalResults: 0
    });
    return dispatch('fetchSemanticQuery', request)
      .then(response => {
        commit('setSemanticQuery', {
          request,
          results: response?.results ?? [],
          status: 'success',
          totalResults: response?.totalResults ?? 0
        });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        commit('setStatus', { query, status: 'error' });
      });
  };
