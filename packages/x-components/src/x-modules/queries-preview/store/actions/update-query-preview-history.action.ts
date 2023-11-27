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
    const loadedQueryPreview = getters.loadedQueriesPreview[query].request.query;

    // If the query preview was already stored, remove the old one.
    if (state.queryPreviewHistory.some(item => item === loadedQueryPreview)) {
      commit('clearFromQueryPreviewHistory', query);
    }

    // If the queryPreviewHistory list exceeds the configured max.length to store,
    // remove the first item from the list and from the QueriesPreview state.
    if (state.queryPreviewHistory.length === state.config.maxQueryPreviewHistoryLength) {
      commit('shiftQueryPreviewHistory');
      commit(
        'clearQueryPreview',
        state.queriesPreview[Object.keys(state.queriesPreview)[0]].request.query
      );
    }

    // Add the query preview item query to the queryPreviewHistory.
    commit('setQueryPreviewHistory', query);
  };
