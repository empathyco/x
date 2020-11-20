import { Filter } from '@empathy/search-types';
import { ActionsClass } from '../../../../store/actions.types';
import { FacetsActionsContext, FacetsXStoreModule } from '../types';

/**
 * Class implementation for the clearing filters actions.
 *
 * @public
 */
export class ClearFilters implements ActionsClass<FacetsXStoreModule> {
  /**
   * Default implementation for {@link FacetsActions.clearSelectedFilters}.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @public
   */
  clearSelectedFilters({ getters, commit }: FacetsActionsContext): void {
    getters.selectedFilters.forEach(this.deselect(commit));
  }
  /**
   * Default implementation for {@link FacetsActions.clearFacetsSelectedFilters}.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @param facetIds - The facet ids to clear its selected filters.
   * @public
   */
  clearFacetsSelectedFilters({ getters, commit }: FacetsActionsContext, facetIds: string[]): void {
    getters.selectedFilters.filter(this.belongsToFacets(facetIds)).forEach(this.deselect(commit));
  }

  /**
   * Creates a function to filter if a filter's facet is included in a list of facets ids.
   *
   * @param facetIds - The facet ids that the filter should belong to.
   * @returns A function to check if a filter's facet belongs to a list of facet ids.
   * @internal
   */
  protected belongsToFacets(facetIds: string[]): (filter: Filter) => boolean {
    return filter => facetIds.includes(filter.facetId);
  }

  /**
   * Creates a function to deselect a filter.
   *
   * @param commit - The `commit` Vuex function.
   * @returns A function that deselects a filter.
   * @internal
   */
  protected deselect(commit: FacetsActionsContext['commit']): (filter: Filter) => void {
    return filter => {
      commit('setFilterSelected', { filter, selected: false });
    };
  }
}

const clearFilters = new ClearFilters();
// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc ClearFilters.clearSelectedFilters}
 *
 * @public
 */
export const clearSelectedFilters = clearFilters.clearSelectedFilters.bind(clearFilters);
// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc ClearFilters.clearFacetsSelectedFilters}
 *
 * @public
 */
export const clearFacetsSelectedFilters = clearFilters.clearFacetsSelectedFilters.bind(
  clearFilters
);
