import { Facet } from '@empathy/search-types';
import { Dictionary } from '../../../../utils/types';
import { FacetsXStoreModule, FiltersByFacet } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFiltersByFacet} getter.
 *
 * @param _state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets
 * module.
 *
 * @returns A dictionary grouping the selected filters by their facet id.
 * @public
 */
export const selectedFiltersByFacet: FacetsXStoreModule['getters']['selectedFiltersByFacet'] = (
  _state,
  { facets, selectedFilters }
): FiltersByFacet => {
  const selectedFiltersByFacet = createEmptyFacetsDictionary(facets);
  selectedFilters.forEach(selectedFilter => {
    selectedFiltersByFacet[selectedFilter.facetId].push(selectedFilter);
  });

  return selectedFiltersByFacet;
};

/**
 * Create a dictionary with empty arrays for each facet id.
 *
 * @param facets - The facets dictionary.
 *
 * @returns A dictionary with existing facet ids as keys and empty arrays as values.
 */
function createEmptyFacetsDictionary(facets: Dictionary<Facet>): FiltersByFacet {
  const facetKeys = Object.keys(facets);
  return facetKeys.reduce((filtersByFacet: FiltersByFacet, key) => {
    filtersByFacet[key] = [];
    return filtersByFacet;
  }, {});
}
