import { deepEqual } from '@empathyco/x-utils';
import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewActions.updateQueryPreviewHistory}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context}
 * of the actions, provided by Vuex.
 * @param request - The query preview request.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const updateQueryPreviewHistory: QueriesPreviewXStoreModule['actions']['updateQueryPreviewHistory'] =
  ({ commit, state, getters }, request) => {
    const { query } = request;
    const loadedQueryPreview = getters.loadedQueriesPreview[query];

    // If the query preview item was already stored, remove the old one.
    if (state.queryPreviewHistory.some(item => deepEqual(item, loadedQueryPreview))) {
      commit('removeFromQueryPreviewHistory', {
        request,
        results: loadedQueryPreview.results,
        status: loadedQueryPreview.status,
        totalResults: loadedQueryPreview.totalResults
      });
    }

    // If the queryPreviewHistory list exceeds the configured max.length to store,
    // pop the last item
    if (state.queryPreviewHistory.length === state.config.maxQueryPreviewHistoryLength) {
      commit('popQueryPreviewHistory');
    }

    // Add query preview item to the queryPreviewHistory.
    commit('setQueryPreviewHistory', {
      request,
      results: loadedQueryPreview.results,
      status: loadedQueryPreview.status,
      totalResults: loadedQueryPreview.totalResults
    });
  };
