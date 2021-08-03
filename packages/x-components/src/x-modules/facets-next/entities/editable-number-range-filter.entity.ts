import {
  EditableNumberRangeFilter,
  Filter,
  isEditableNumberRangeFilter
} from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { EquatableFilter } from './equatable-filter';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link EditableNumberRangeFilter}.
 */
export class EditableNumberRangeFilterEntity extends EquatableFilter implements FilterEntity {
  public constructor(protected store: Store<unknown>, protected filter: EditableNumberRangeFilter) {
    super(filter);
  }

  static accepts(filter: Filter): boolean {
    return isEditableNumberRangeFilter(filter);
  }

  /**
   * It sets {@link EditableNumberRangeFilter.selected} to false and reset the
   * {@link EditableNumberRangeFilter.range} values to null.
   */
  deselect(): void {
    this.store.commit('x/facetsNext/setFilter', {
      ...this.filter,
      selected: false,
      range: { min: null, max: null }
    });
  }

  /**
   * It selects the {@link EditableNumberRangeFilter}.
   *
   * @remarks If the filter has no selected range, then filter is deselected when this
   * method is called.
   */
  select(): void {
    this.store.commit('x/facetsNext/setFilter', {
      ...this.filter,
      selected: this.isSelected()
    });
  }

  /**
   * It returns if the filter range min or the filter range max is not null.
   *
   * @returns True if filter range min or filter range max is not null.
   */
  protected isSelected(): boolean {
    return this.filter.range.min !== null || this.filter.range.max !== null;
  }
}
