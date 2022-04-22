import { isFacetFilter } from '@empathyco/x-types';
import { map } from '@empathyco/x-utils';
import { groupItemsBy } from '../../../../utils/array';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.facets} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @returns An array containing the facets with the filters.
 *
 * @public
 */
export const facets: FacetsXStoreModule['getters']['facets'] = state => {
  const filtersByFacet = groupItemsBy(Object.values(state.filters), filter =>
    isFacetFilter(filter) ? filter.facetId : '__unknown-facet__'
  );
  return map(state.facets, (_id, facet) => ({
    ...facet,
    filters: filtersByFacet[facet.id] ?? []
  }));
};
