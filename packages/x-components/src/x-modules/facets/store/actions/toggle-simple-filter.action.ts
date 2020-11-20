import { SimpleFacet, SimpleFilter } from '@empathy/search-types';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for {@link FacetsActions.toggleSimpleFilter}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param filter - The filter to toggle its selected state.
 *
 * @public
 */
export const toggleSimpleFilter: FacetsXStoreModule['actions']['toggleSimpleFilter'] = (
  { commit, state },
  filter
) => {
  const facetId = filter.facetId;
  const isMultiSelect = state.config.multiSelect[facetId];
  if (!isMultiSelect) {
    /*
     If the filter is not multi selectable, we search the facet to see if it has a
     selected sibling. If it does, then we deselect it.
     */
    const facet = state.facets[facetId] as SimpleFacet;
    const selectedSibling = facet.filters.find(selectedSiblingOf(filter));
    if (selectedSibling) {
      commit('setFilterSelected', { filter: selectedSibling, selected: false });
    }
  }

  commit('setFilterSelected', { filter, selected: !filter.selected });
};

/**
 * Creates a function that checks if a filter is a sibling of the provided filter and it is
 * selected.
 *
 * @param filter - The filter to find its selected sibling.
 * @returns A function to check if a filter is selected, and it is a sibling of the provided filter.
 * @internal
 */
function selectedSiblingOf(filter: SimpleFilter): (filter: SimpleFilter) => boolean {
  return sibling => sibling.selected && sibling !== filter;
}
