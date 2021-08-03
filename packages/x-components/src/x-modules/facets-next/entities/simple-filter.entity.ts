import { isSimpleFilter, SimpleFilter, Filter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { EquatableFilter } from './equatable-filter';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link SimpleFilter}.
 */
export class SimpleFilterEntity extends EquatableFilter implements FilterEntity {
  public constructor(protected store: Store<unknown>, protected filter: SimpleFilter) {
    super(filter);
  }

  static accepts(filter: Filter): boolean {
    return isSimpleFilter(filter);
  }

  deselect(): void {
    this.store.commit('x/facetsNext/setFilter', { ...this.filter, selected: false });
  }

  select(): void {
    this.store.commit('x/facetsNext/setFilter', { ...this.filter, selected: true });
  }
}
