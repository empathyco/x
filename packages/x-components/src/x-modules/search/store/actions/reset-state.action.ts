import { isArrayEmpty } from '../../../../utils/array';
import { getNewAndUpdatedKeys } from '../../../../utils/object';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.resetState}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
export const resetState: SearchXStoreModule['actions']['resetState'] = (
  { commit, state },
  { newRequest, oldRequest }
) => {
  const changedKeys = getNewAndUpdatedKeys(newRequest, oldRequest);

  if (!isArrayEmpty(changedKeys)) {
    if (!changedKeys.includes('page')) {
      commit('setPage', 1);
    }
    if (changedKeys.includes('query')) {
      commit('setSort', '');
    }

    const haveExtraParamsChanged = changedKeys.some(key => key in state.params);
    if (haveExtraParamsChanged) {
      commit('setPage', 1);
      commit('setSort', '');
    }
  }
};
