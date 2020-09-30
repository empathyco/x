import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchGetters.results} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the search
 * module.
 * @returns The results.
 *
 * @public
 */
export const results: SearchXStoreModule['getters']['results'] = ({ results }) => {
  return results;
};
