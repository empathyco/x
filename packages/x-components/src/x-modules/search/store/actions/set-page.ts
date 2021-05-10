import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setPage}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param newPage - The new page value to set in the search module.
 *
 * @public
 */
export const setPage: SearchXStoreModule['actions']['setPage'] = ({ commit, state }, newPage) => {
  if (newPage >= 1 && newPage * state.config.pageSize <= state.totalResults) {
    commit('setPage', newPage);
  }
};
