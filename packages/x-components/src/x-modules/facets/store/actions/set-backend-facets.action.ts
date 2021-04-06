import { arrayToObject } from '../../../../utils/array';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsActions.setBackendFacets}. Transforms
 * the facets array into a record and stores them in the module state.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
 * actions, provided by Vuex.
 * @param newFacets - Facets array to store.
 *
 * @public
 */
export const setBackendFacets: FacetsXStoreModule['actions']['setBackendFacets'] = (
  { commit },
  newFacets
) => {
  commit('setBackendFacets', arrayToObject(newFacets, 'id'));
};
