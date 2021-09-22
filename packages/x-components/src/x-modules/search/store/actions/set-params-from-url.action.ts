import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setParamsFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 *
 * @public
 */
export const setParamsFromUrl: SearchXStoreModule['actions']['setParamsFromUrl'] = (
  { commit },
  { query, page, sort }
) => {
  const newQuery = query as string;
  const newPage = page as number;
  const newSort = sort as string;

  if (newQuery) {
    commit('setQuery', newQuery);
  }

  if (newPage) {
    commit('setPage', newPage);
  }

  if (newSort) {
    commit('setSort', newSort);
  }
};
