import { isNewQuery } from '../../../facets';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setQueryFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
export const setQueryFromUrl: SearchXStoreModule['actions']['setQueryFromUrl'] = (
  { commit, state: { query } },
  urlParams
) => {
  const newQuery = urlParams.query as string;

  if (newQuery && isNewQuery(newQuery, query)) {
    commit('setQuery', newQuery);
  }
};
