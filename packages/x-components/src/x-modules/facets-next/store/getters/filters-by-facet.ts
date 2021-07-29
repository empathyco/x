import { isFacetFilter } from '@empathyco/x-types-next';
import { groupItemsBy } from '../../../../utils/array';
import { FacetsNextXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsNextGetters.filtersByFacet} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 *
 * @returns A record containing the filters indexed by its facet id.
 *
 * @public
 */
export const filtersByFacet: FacetsNextXStoreModule['getters']['filtersByFacet'] = state => {
  const filtersWithFacet = Object.values(state.filters).filter(isFacetFilter);
  return groupItemsBy(filtersWithFacet, filter => filter.facetId);
};
