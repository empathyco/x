import { Filter } from '@empathy/search-types';
import { deepFilter, reduce } from '../../../../utils';
import { isFilterSelected, isHierarchicalFilter } from '../../../../utils/filters';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFilters} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 *
 * @returns Array of selected filters.
 *
 * @public
 */
export const selectedFilters: FacetsXStoreModule['getters']['selectedFilters'] = (
  state
): Filter[] => {
  return reduce(
    state.facets,
    (selectedFilters, _facetName, facet) => {
      if (isHierarchicalFilter(facet)) {
        selectedFilters.push(...deepFilter(facet.filters, isFilterSelected, 'children'));
      } else {
        selectedFilters.push(...facet.filters.filter(isFilterSelected));
      }
      return selectedFilters;
    },
    <Filter[]>[]
  );
};
