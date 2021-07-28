import { Facet } from '@empathyco/x-types-old';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.facets} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 *
 * @returns A dictionary of facets.
 *
 * @public
 */
export const facets: FacetsXStoreModule['getters']['facets'] = (
  state
): Record<Facet['id'], Facet> => {
  return { ...state.backendFacets, ...state.frontendFacets };
};
