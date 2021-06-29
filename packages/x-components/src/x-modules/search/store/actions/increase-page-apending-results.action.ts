import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.increasePageAppendingResults}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const increasePageAppendingResults: SearchXStoreModule['actions']['increasePageAppendingResults'] =
  ({ commit, state }) => {
    const newPage = state.page + 1;
    if (newPage >= 1 && newPage * state.config.pageSize <= state.totalResults) {
      commit('setPage', newPage);
      commit('setIsAppendResults', true);
    }
  };
