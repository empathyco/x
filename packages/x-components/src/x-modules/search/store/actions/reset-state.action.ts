import { getNewAndUpdatedKeys } from '@empathyco/x-utils';
import { isArrayEmpty } from '../../../../utils/array';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.resetState}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param root0
 * @public
 */
export const resetState: SearchXStoreModule['actions']['resetState'] = (
  { commit },
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
    if (changedKeys.includes('extraParams')) {
      commit('setPage', 1);
      commit('setSort', '');
    }
  }
};
