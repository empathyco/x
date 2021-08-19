import { Facet, isFacetFilter } from '@empathyco/x-types-next';
import { FacetsNextXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsNextGetters.facets} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @returns An array containing the facets with the filters.
 *
 * @public
 */
export const facets: FacetsNextXStoreModule['getters']['facets'] = state => {
  return Object.values(state.facets).reduce((facets, facet) => {
    facets[facet.id] = {
      ...facet,
      filters: Object.values(state.filters).filter(
        filter => isFacetFilter(filter) && filter.facetId === facet.id
      )
    };
    return facets;
  }, {} as Record<Facet['id'], Facet>);
};
