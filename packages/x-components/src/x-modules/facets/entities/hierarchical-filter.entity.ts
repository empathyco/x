import { HierarchicalFilter, isHierarchicalFilter } from '@empathyco/x-types';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../store/store.types';
import { addFacetIfNotPresent } from './add-facet-if-not-present';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link @empathyco/x-types#HierarchicalFilter
 * | HierarchicalFilter}.
 *
 * @internal
 */
export class HierarchicalFilterEntity implements FilterEntity {
  public static accepts = isHierarchicalFilter;

  public constructor(protected store: Store<RootXStoreState>) {}

  /**
   * Deselects the hierarchical filter and all of its descendants.
   *
   * @param filter - The filter to deselect.
   */
  deselect(filter: HierarchicalFilter): void {
    this.saveFilter(filter, { selected: false });
    this.deselectDescendants(filter);
    addFacetIfNotPresent(this.store, filter.facetId, 'HierarchicalFacet');
  }

  /**
   * Selects the hierarchical filter and its ancestors.
   *
   * @param filter - The filter to select.
   */
  select(filter: HierarchicalFilter): void {
    this.saveFilter(filter, { selected: true });
    this.selectAncestors(filter);
    addFacetIfNotPresent(this.store, filter.facetId, 'HierarchicalFacet');
  }

  /**
   * Deselects all the descendants of the given filter, saving them to the store.
   *
   * @remarks The descendants hierarchy is retrieved from the store.
   * @param filter - The filter to deselect its descendants.
   * @internal
   */
  protected deselectDescendants(filter: HierarchicalFilter): void {
    if (filter.children) {
      filter.children.forEach(child => {
        this.saveFilter(child, { selected: false });
        this.deselectDescendants(child);
      });
    }
  }

  /**
   * Selects all the ancestors of the given filter, saving them to the store.
   *
   * @remarks The ancestors hierarchy is retrieved from the store.
   * @param filter - The filter to select its ancestors.
   * @internal
   */
  protected selectAncestors(filter: HierarchicalFilter): void {
    if (filter.parentId) {
      const parent = this.getFilterById(filter.parentId);
      if (parent) {
        this.saveFilter(parent, { selected: true });
        this.selectAncestors(parent);
      }
    }
  }

  /**
   * Retrieves a hierarchical filter from the store by its id.
   *
   * @param id - The id of the filter to retrieve.
   * @returns The hierarchical filter retrieved from the store.
   * @internal
   */
  protected getFilterById(id: HierarchicalFilter['id']): HierarchicalFilter {
    return this.store.state.x.facets.filters[id] as HierarchicalFilter;
  }

  /**
   * Saves the given filter to the store.
   *
   * @param filter - The filter to save to the store.
   * @param newFilterState - The new partial state of the filter.
   * @internal
   */
  protected saveFilter(
    filter: HierarchicalFilter,
    newFilterState: Partial<HierarchicalFilter> = {}
  ): void {
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState });
  }
}
