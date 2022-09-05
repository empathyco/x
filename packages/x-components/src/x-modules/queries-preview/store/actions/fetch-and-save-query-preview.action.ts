import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewActions.fetchAndSaveQueryPreview}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The query preview request to make.
 * @returns A Promise of a SearchResponse when it fetches the results.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const fetchAndSaveQueryPreview: QueriesPreviewXStoreModule['actions']['fetchAndSaveQueryPreview'] =
  ({ dispatch, commit }, request) => {
    const { query } = request;
    if (!query) {
      return;
    }
    commit('setQueryPreview', {
      request,
      results: [],
      status: 'loading',
      totalResults: 0
    });
    return dispatch('fetchQueryPreview', request)
      .then(response => {
        commit('setQueryPreview', {
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
