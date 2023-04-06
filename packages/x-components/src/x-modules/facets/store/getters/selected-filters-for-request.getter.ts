import { isHierarchicalFilter } from '@empathyco/x-types';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFiltersForRequest} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets'
 * module.
 *
 * @returns A list containing the selected filters that conform to the filters for request strategy.
 *
 * @public
 */
export const selectedFiltersForRequest: FacetsXStoreModule['getters']['selectedFilters'] = state =>
  Object.values(state.filters)
    .filter(filter => filter.selected)
    .filter((filter, _, filters) => {
      if (
        state.config.filtersForRequestStrategy === 'leaves-only' &&
        isHierarchicalFilter(filter)
      ) {
        const childrenIds = filter.children?.map(child => child.id);

        return !filters.some(newFilter => childrenIds?.includes(newFilter.id));
      }

      return true;
    });
