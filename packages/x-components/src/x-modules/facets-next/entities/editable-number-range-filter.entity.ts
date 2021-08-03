import {
  EditableNumberRangeFilter,
  Filter,
  isEditableNumberRangeFilter,
  SimpleFilter
} from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { EquatableFilter } from './equatable-filter';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link EditableNumberRangeFilter}.
 */
export class EditableNumberRangeFilterEntity
  extends EquatableFilter
  implements FilterEntity<EditableNumberRangeFilter>
{
  public constructor(protected store: Store<unknown>, protected filter: EditableNumberRangeFilter) {
    super(filter);
  }

  static accepts(filter: Filter): boolean {
    return isEditableNumberRangeFilter(filter);
  }

  /**
   * It sets {@link EditableNumberRangeFilter.selected} to false and reset the {@link EditableNumberRangeFilter.range}
   * values to null.
   */
  deselect(): void {
    this.store.commit('x/facetsNext/setFilter', {
      ...this.filter,
      selected: false,
      range: { min: null, max: null }
    });
  }

  /**
   * It selects the {@link EditableNumberRangeFilter} using the range of `newFilter` parameter as new state.
   *
   * @param newFilter - The filter to use its range as new state. If `newFilter` is undefined it
   * doesn't perform any action.
   *
   * @remarks If the passed `newfilter` has no selected range, the filter is deselected when this
   * method is called.
   */
  select(newFilter?: EditableNumberRangeFilter): void {
    if (newFilter !== undefined) {
      const newState = this.isSelected(newFilter)
        ? { selected: true, range: { ...newFilter.range } }
        : { selected: false, range: { min: null, max: null } };
      this.store.commit('x/facetsNext/setFilter', {
        ...this.filter,
        ...newState
      });
    }
  }

  protected isSelected(filter: EditableNumberRangeFilter): boolean {
    return filter.range.min !== null || filter.range.max !== null;
  }
}
