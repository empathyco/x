import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewActions.fetchAndSaveQueryPreview}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The query preview request to make.
 * @returns A Promise of a SearchResponse when it fetches the results.
 */
// eslint-disable-next-line max-len
export const fetchAndSaveQueryPreview: QueriesPreviewXStoreModule['actions']['fetchAndSaveQueryPreview'] =
  ({ dispatch, commit }, request) => {
    const { query } = request;
    return dispatch('fetchQueryPreview', request)
      .then(response => {
        if (response) {
          commit('setQueriesPreview', {
            [query]: {
              query,
              request,
              results: response.results,
              status: 'success',
              totalResults: response.totalResults
            }
          });
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        commit('setStatus', { query, status: 'error' });
      });
  };
