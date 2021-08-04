import { isHierarchicalFilter, HierarchicalFilter, Filter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../store/store.types';
import { EquatableFilter } from './equatable-filter';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link HierarchicalFilter}.
 */
export class HierarchicalFilterEntity extends EquatableFilter implements FilterEntity {
  public constructor(
    protected store: Store<RootXStoreState>,
    protected filter: HierarchicalFilter
  ) {
    super(filter);
  }

  static accepts(filter: Filter): boolean {
    return isHierarchicalFilter(filter);
  }

  /**
   * Deselects the hierarchical filter and all of its descendants.
   */
  deselect(): void {
    this.saveFilter({ ...this.filter, selected: false });
    this.deselectDescendants(this.filter);
  }

  /**
   * Selects the hierarchical filter and its ancestors.
   */
  select(): void {
    this.saveFilter({ ...this.filter, selected: true });
    this.selectAncestors(this.filter);
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
      this.saveFilter({ ...parent, selected: true });
      this.selectAncestors(parent);
    }
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
      filter.children.forEach(childId => {
        const child = this.getFilterById(childId);
        this.saveFilter({ ...child, selected: false });
        this.deselectDescendants(child);
      });
    }
  }

  /**
   * Saves the given filter to the store.
   *
   * @param filter - The filter to save to the store.
   * @internal
   */
  protected saveFilter(filter: HierarchicalFilter): void {
    this.store.commit('x/facetsNext/setFilter', filter);
  }

  protected getFilterById(id: HierarchicalFilter['id']): HierarchicalFilter {
    return this.store.state.x.facetsNext.filters[id] as HierarchicalFilter;
  }
}
