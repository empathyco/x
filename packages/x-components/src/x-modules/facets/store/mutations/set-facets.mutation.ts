import { arrayToObject } from '../../../../utils';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsMutations.setFacets}. The mutation also transforms
 * the facets array to a object of facets. Then, any facet is accessible trough its id.
 *
 * @param state - The {@link https://vuex.vuejs.org/guide/state.html | state} provided by Vuex.
 * @param newFacets - Facets array.
 */
export const setFacets: FacetsXStoreModule['mutations']['setFacets'] = (state, newFacets) => {
  state.facets = arrayToObject(newFacets, 'id');
};
