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

  deselect(): void {
    this.store.commit('x/facetsNext/removeFilter', this.filter);
  }

  select(): void {
    this.store.commit('x/facetsNext/setFilter', this.filter);
  }
}
