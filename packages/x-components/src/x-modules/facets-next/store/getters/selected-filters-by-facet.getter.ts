import { isFacetFilter } from '@empathyco/x-types-next';
import { groupItemsBy } from '../../../../utils/array';
import { FacetsNextXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsNextGetters.filtersByFacet} getter.
 *
 * @param _ - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets module.
 *
 * @returns A record containing the selected filters indexed by its facet id.
 * @remarks If there are filters without facet Id (RawFilter), they will be grouped under
 * `__unknown-facet__` key.
 *
 * @public
 */
export const selectedFiltersByFacet: FacetsNextXStoreModule['getters']['selectedFiltersByFacet'] = (
  _,
  getters
) => {
  return groupItemsBy(getters.selectedFilters, filter =>
    isFacetFilter(filter) ? filter.facetId : '__unknown-facet__'
  );
};
