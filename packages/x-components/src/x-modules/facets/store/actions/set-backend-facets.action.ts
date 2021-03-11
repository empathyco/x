import { BooleanFilter, HierarchicalFilter, isHierarchicalFacet } from '@empathy/search-types';
import { arrayToObject } from '../../../../utils';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsActions.setBackendFacets}. The action overwrites
 * every filter.selected from newFacets with the current state (we can't trust in the value got from
 * the adapter). It also transforms the array to a dictionary in order to access easily by its
 * id.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
 * actions, provided by Vuex.
 * @param newFacets - Facets array.
 *
 * @public
 */
export const setBackendFacets: FacetsXStoreModule['actions']['setBackendFacets'] = (
  { state: { config }, getters: { flattenedFilters }, commit },
  newFacets
) => {
  /**
   * Sets the selected value of the filter passed as parameter with the selected value from the
   * filter stored in the state (getter) with the same id.
   *
   * @param filter - Target filter to set its selected property.
   */
  function setStateSelectedBooleanFilter(filter: BooleanFilter): void {
    commit('setFilterSelected', {
      filter,
      selected: !!(flattenedFilters[filter.id] as BooleanFilter)?.selected
    });
  }

  /**
   * Iterates over the filters array passed as parameter in order to set each filter.selected
   * value. This function is not used for HierarchicalFilters.
   *
   * @param filters - Target filter to set its selected property.
   */
  function setStateSelectedBooleanFilters(filters: BooleanFilter[]): void {
    filters.forEach(setStateSelectedBooleanFilter);
  }

  /**
   * Iterates over the filters array passed as parameter in order to set each filter.selected
   * value. This function is just used for HierarchicalFilters.
   *
   * @param filters - Target hierarchical filters to set its selected property.
   */
  function setStateSelectedHierarchicalFilters(filters: HierarchicalFilter[]): void {
    filters.forEach(filter => {
      setStateSelectedBooleanFilter(filter);
      if (filter.children.length) {
        setStateSelectedHierarchicalFilters(filter.children);
      }
    });
  }

  if (config.ignoreNewFiltersSelected) {
    newFacets.forEach(facet => {
      if (isHierarchicalFacet(facet)) {
        setStateSelectedHierarchicalFilters(facet.filters);
      } else {
        setStateSelectedBooleanFilters(facet.filters as BooleanFilter[]);
      }
    });
  }
  commit('setBackendFacets', arrayToObject(newFacets, 'id'));
};
