import { SimpleFilter, NumberRangeFilter, BooleanFilter } from '@empathyco/x-types';
import { FacetsActionsContext, FacetsXStoreModule } from '../types';

/**
 * Default implementation for {@link FacetsActions.toggleSimpleFilter}.
 *
 * @public
 */
export const toggleSimpleFilter: FacetsXStoreModule['actions']['toggleSimpleFilter'] = toggleFilter;

/**
 * Default implementation for {@link FacetsActions.toggleNumberRangeFilter}.
 *
 * @public
 */
export const toggleNumberRangeFilter: FacetsXStoreModule['actions']['toggleNumberRangeFilter'] =
  toggleFilter;

/**
 * Select or deselect filter.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param filter - The filter to select or deselect.
 * @internal
 */
function toggleFilter(
  { state, getters, commit }: FacetsActionsContext,
  filter: SimpleFilter | NumberRangeFilter
): void {
  const facetId = filter.facetId;
  const isMultiSelect = state.config.multiSelect[facetId];
  if (!isMultiSelect) {
    /*
     If the filter is not multi selectable, we search the facet to see if it has a
     selected sibling. If it does, then we deselect it.
     */
    const facet = getters.facets[facetId];
    const selectedSibling = (<(SimpleFilter | NumberRangeFilter)[]>facet.filters).find(
      selectedSiblingOf(filter)
    );
    if (selectedSibling) {
      commit('setFilterSelected', { filter: selectedSibling, selected: false });
    }
  }

  commit('setFilterSelected', { filter, selected: !filter.selected });
}

/**
 * Creates a function that checks if a filter is a sibling of the provided filter and it is
 * selected.
 *
 * @param filter - The filter to find its selected sibling.
 * @returns A function to check if a filter is selected, and it is a sibling of the provided filter.
 * @internal
 */
function selectedSiblingOf(filter: BooleanFilter): (filter: BooleanFilter) => boolean {
  return sibling => sibling.selected && sibling !== filter;
}
