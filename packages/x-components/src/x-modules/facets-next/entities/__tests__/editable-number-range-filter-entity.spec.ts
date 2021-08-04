import { EditableNumberRangeFilter } from '@empathyco/x-types';
import { createNextEditableNumberRangeFilter } from '../../../../__stubs__/filters-stubs.factory';
import { EditableNumberRangeFilterEntity } from '../editable-number-range-filter.entity';
import { isFilterSelected, prepareFacetsStore } from './utils';

describe('testing EditableNumberRangeFilterEntity', () => {
  it('allows selecting a non selected filter when its min value is not null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: 3, max: null }, false);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(false);
    filterEntity.select();
    expect(isFilterSelected(store, filter.id)).toBe(true);
  });

  it('allows selecting a non selected filter when its max value is not null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: null, max: 5 }, false);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(false);
    filterEntity.select();
    expect(isFilterSelected(store, filter.id)).toBe(true);
  });

  it('allows deselecting a selected filter and set its range values to null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: 2, max: 10 }, true);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(true);
    filterEntity.deselect();
    expect(isFilterSelected(store, filter.id)).toBe(false);
    expect(
      (store.state.x.facetsNext.filters[filter.id] as unknown as EditableNumberRangeFilter).range
        .min
    ).toBeNull();
    expect(
      (store.state.x.facetsNext.filters[filter.id] as unknown as EditableNumberRangeFilter).range
        .max
    ).toBeNull();
  });

  it('deselects a selected filter when filter range values are null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: null, max: null }, true);
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    expect(filter.selected).toBe(true);
    filterEntity.select();
    expect(isFilterSelected(store, filter.id)).toBe(false);
  });
});
