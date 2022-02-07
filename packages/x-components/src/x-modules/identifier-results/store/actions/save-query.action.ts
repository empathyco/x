import { IdentifierResultsXStoreModule } from '../types';

/**
 * Default implementation for the {@link IdentifierResultsActions.saveQuery}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param query - The query to try to add to the store.
 *
 * @public
 */
export const saveQuery: IdentifierResultsXStoreModule['actions']['saveQuery'] = (
  { commit, getters },
  query: string
) => {
  if (getters.identifierDetectionRegexp.test(query)) {
    commit('setQuery', query);
  } else {
    commit('setQuery', '');
    commit('setIdentifierResults', []);
  }
};
