import { isArrayEmpty } from '../../../../utils/array';
import { getKeysWithDifferentValue } from '../../../../utils/object';
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
  const changedKeys = getKeysWithDifferentValue(newRequest, oldRequest);
  const extraParamsKeys = Object.keys(state.params);
  const haveExtraParamsChanged = changedKeys.some(key => extraParamsKeys.includes(key as string));

  if (!isArrayEmpty(changedKeys)) {
    if (!changedKeys.includes('page')) {
      commit('setPage', 1);
    }
    if (changedKeys.includes('query')) {
      commit('setSort', '');
    }
    if (haveExtraParamsChanged) {
      commit('setPage', 1);
      commit('setSort', '');
    }
  }
};
