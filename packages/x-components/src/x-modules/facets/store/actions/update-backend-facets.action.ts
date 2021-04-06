import { BooleanFilter, Filter, isBooleanFilter } from '@empathy/search-types';
import { extractFilters } from '../../../../utils/filters';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsActions.updateBackendFacets}. The action overwrites
 * every filter.selected from newFacets with the current state (we can't trust in the value got from
 * the adapter). It also transforms the array to a dictionary in order to access easily by its
 * id.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
 * actions, provided by Vuex.
 * @param newFacets - Facets array.
 * @returns A Promise that resolves after updating the filters.
 *
 * @public
 */
export const updateBackendFacets: FacetsXStoreModule['actions']['updateBackendFacets'] = (
  { getters: { flattenedFilters }, dispatch, commit },
  newFacets
) => {
  const backendFilters = extractFilters(newFacets);
  backendFilters.forEach(setStateSelectedBooleanFilter);

  return dispatch('setBackendFacets', newFacets);

  /**
   * Sets the selected value of the filter passed as parameter with the selected value from the
   * filter stored in the state (getter) with the same id.
   *
   * @param filter - Target filter to set its selected property.
   */
  function setStateSelectedBooleanFilter(filter: Filter): void {
    if (isBooleanFilter(filter)) {
      commit('setFilterSelected', {
        filter,
        selected: !!(flattenedFilters[filter.id] as BooleanFilter)?.selected
      });
    }
  }
};
