import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.fetchAndSaveSearchResponse}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when the results and facets finishes updating.
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchAndSaveSearchResponse: SearchXStoreModule['actions']['fetchAndSaveSearchResponse'] = ({
  dispatch,
  commit
}) =>
  dispatch('fetchSearchResponse').then(({ results, facets }) => {
    commit('setResults', results);
    commit('setFacets', facets);
  });
