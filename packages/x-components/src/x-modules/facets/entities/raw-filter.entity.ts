import { isRawFilter, RawFilter } from '@empathyco/x-types';
import { Store } from 'vuex';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link @empathyco/x-types#RawFilter | RawFilter}.
 *
 * @internal
 */
export class RawFilterEntity implements FilterEntity {
  public static accepts = isRawFilter;

  public constructor(protected store: Store<unknown>) {}

  /**
   * It deselects the {@link @empathyco/x-types#RawFilter | RawFilter}.
   *
   * @param filter - The filter to deselect.
   * @remarks As the {@link @empathyco/x-types#RawFilter.selected} is always true,
   * the deselection just removes the filter from the store.
   */
  deselect(filter: RawFilter): void {
    this.store.commit('x/facets/removeFilter', filter);
  }

  /**
   * It selects the {@link @empathyco/x-types#RawFilter | RawFilter}.
   *
   * @param filter - The filter to select.
   * @remarks As the {@link @empathyco/x-types#RawFilter.selected} is always true,
   * there is no need to set this property.
   */
  select(filter: RawFilter): void {
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: true } });
  }
}
