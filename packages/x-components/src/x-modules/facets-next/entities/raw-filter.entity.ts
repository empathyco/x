import { isRawFilter, RawFilter, Filter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { EquatableFilter } from './equatable-filter';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link RawFilter}.
 */
export class RawFilterEntity extends EquatableFilter implements FilterEntity {
  public constructor(protected store: Store<unknown>, protected filter: RawFilter) {
    super(filter);
  }

  static accepts(filter: Filter): boolean {
    return isRawFilter(filter);
  }

  /**
   * It deselects the {@link RawFilter}.
   *
   * @remarks As the {@link RawFilter.selected} is always true,
   * the deselection just removes the filter from the store.
   */
  deselect(): void {
    this.store.commit('x/facetsNext/removeFilter', this.filter);
  }

  /**
   * It selects the {@link RawFilter}.
   *
   * @remarks As the {@link RawFilter.selected} is always true,
   * there is no need to set this property.
   */
  select(): void {
    this.store.commit('x/facetsNext/setFilter', { ...this.filter });
  }
}
