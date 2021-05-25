import { Filter, HierarchicalFilter } from '@empathy/search-types';
import { FacetsActionsContext, FacetsXStoreModule } from '../types';

/**
 * Default implementation for {@link FacetsActions.toggleHierarchicalFilter}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param filter - The filter to toggle its selected state.
 *
 * @public
 */
export const toggleHierarchicalFilter: FacetsXStoreModule['actions']['toggleHierarchicalFilter'] = (
  { commit, getters, state, dispatch },
  filter
) => {
  const facetId = filter.facetId;
  const isMultiSelect = state.config.multiSelect[facetId];
  const newSelectedValue = !filter.selected;
  if (!isMultiSelect) {
    dispatch('clearFacetsSelectedFilters', [facetId]);
  }

  commit('setFilterSelected', { filter, selected: newSelectedValue });

  selectFilterAncestors(commit, getters.flattenedFilters, filter);
  /* If the filter is NOT multi-selectable, its children are already deselected at this point, so we
   only need to deselect them if the filter supports multi-selection and has been de-selected */
  if (isMultiSelect && !newSelectedValue) {
    deselectFilterDescendants(commit, filter);
  }
};

/**
 * Selects all the ancestors of a filter hierarchy.
 *
 * @param commit - The store commit function, to perform the filter selection.
 * @param allFilters - A dictionary that contains all the filters indexed by its
 * id.
 * @param filter - The filter to select its ancestors.
 * @internal
 */
function selectFilterAncestors(
  commit: FacetsActionsContext['commit'],
  allFilters: Record<Filter['id'], Filter>,
  filter: HierarchicalFilter
): void {
  if (filter.parentId !== null) {
    const parent = allFilters[filter.parentId] as HierarchicalFilter;
    commit('setFilterSelected', { filter: parent, selected: true });
    selectFilterAncestors(commit, allFilters, parent);
  }
}

/**
 * Deselects all the descendants of a given filter.
 *
 * @param commit - The commit function, to deselect a single filter.
 * @param filter - The filter to deselect its descendants.
 */
function deselectFilterDescendants(
  commit: FacetsActionsContext['commit'],
  filter: HierarchicalFilter
): void {
  filter.children?.forEach(filter => {
    commit('setFilterSelected', { filter, selected: false });
    deselectFilterDescendants(commit, filter);
  });
}
