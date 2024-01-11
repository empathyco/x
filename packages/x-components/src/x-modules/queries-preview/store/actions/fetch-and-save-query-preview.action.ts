import { QueriesPreviewXStoreModule, QueryPreviewItem } from '../types';
import { getHashFromQueryPreviewItem } from '../../utils/get-hash-from-query-preview';

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

    const queryPreviewItem: QueryPreviewItem = {
      request,
      results: [],
      status: 'loading',
      totalResults: 0,
      instances: 1
    };

    commit('setQueryPreviewCached', queryPreviewItem);

    return dispatch('fetchQueryPreview', request)
      .then(response => {
        commit('setQueryPreviewCached', {
          request,
          results: response?.results ?? [],
          status: 'success',
          totalResults: response?.totalResults ?? 0,
          instances: 1
        });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        const query = getHashFromQueryPreviewItem(queryPreviewItem);
        commit('setStatus', { query, status: 'error' });
      });
  };
