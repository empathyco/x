import { arrayToObject } from '../../../../utils/array';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsActions.setFrontendFacets}. The action transforms the
 * array to a dictionary in order to access easily by its id.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
 * actions, provided by Vuex.
 * @param newFacets - Facets array.
 *
 * @public
 */
export const setFrontendFacets: FacetsXStoreModule['actions']['setFrontendFacets'] = (
  { commit },
  newFacets
) => {
  commit('setFrontendFacets', arrayToObject(newFacets, 'id'));
};
