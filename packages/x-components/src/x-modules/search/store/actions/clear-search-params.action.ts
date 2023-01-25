import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.clearSearchParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 *
 * @public
 */
export const clearSearchParams: SearchXStoreModule['actions']['clearSearchParams'] = ({
  commit
}) => {
  commit('setPage', 1);
  commit('setQuery', '');
  commit('setSort', '');
};
