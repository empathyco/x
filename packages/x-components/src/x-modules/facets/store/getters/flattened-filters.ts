import { Filter } from '@empathy/search-types';
import { deepFlat, reduce } from '../../../../utils';
import { isHierarchicalFilter } from '../../../../utils/filters';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.flattenedFilters} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 *
 * @returns Array of filters.
 *
 * @public
 */
export const flattenedFilters: FacetsXStoreModule['getters']['flattenedFilters'] = (
  state
): Filter[] => {
  return reduce(
    state.facets,
    (filtersMap, _facetName, facet) => {
      if (isHierarchicalFilter(facet)) {
        filtersMap.push(...deepFlat(facet.filters, 'children'));
      } else {
        filtersMap.push(...facet.filters);
      }
      return filtersMap;
    },
    [] as Filter[]
  );
};
