import { createNextEditableNumberRangeFilter } from '../../../../__stubs__/filters-stubs.factory';
import { EditableNumberRangeFilterEntity } from '../editable-number-range-filter.entity';
import {
  getStoreEditableNumberRangeFilter,
  isEditableNumberRangeFilterSelected,
  prepareFacetsStore
} from './utils';

describe('testing EditableNumberRangeFilterEntity', () => {
  it('allows selecting a non selected filter when its min value is not null', () => {
    const store = prepareFacetsStore();
    const range = { min: 3, max: null };
    const filter = createNextEditableNumberRangeFilter('price', range, false);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(false);
    filterEntity.select();
    expect(isEditableNumberRangeFilterSelected(store, filter.id)).toBe(true);
    expect(getStoreEditableNumberRangeFilter(store, filter.id).range).toEqual(range);
  });

  it('allows selecting a non selected filter when its max value is not null', () => {
    const store = prepareFacetsStore();
    const range = { min: null, max: 5 };
    const filter = createNextEditableNumberRangeFilter('age', range, false);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(false);
    filterEntity.select();
    expect(isEditableNumberRangeFilterSelected(store, filter.id)).toBe(true);
    expect(getStoreEditableNumberRangeFilter(store, filter.id).range).toEqual(range);
  });

  it('allows deselecting a selected filter and set its range values to null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: 2, max: 10 }, true);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(true);
    filterEntity.deselect();
    expect(isEditableNumberRangeFilterSelected(store, filter.id)).toBe(false);
    expect(getStoreEditableNumberRangeFilter(store, filter.id).range).toEqual({
      min: null,
      max: null
    });
  });

  it('deselects a selected filter when filter range values are null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: null, max: null }, true);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(true);
    filterEntity.select();
    expect(isEditableNumberRangeFilterSelected(store, filter.id)).toBe(false);
  });
});
