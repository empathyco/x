import { RangeValue } from '@empathyco/x-types';
import { createEditableNumberRangeFilter } from '../../../../__stubs__/filters-stubs.factory';
import { EditableNumberRangeFilterEntity } from '../editable-number-range-filter.entity';
import {
  getStoreEditableNumberRangeFilter,
  isEditableNumberRangeFilterSelected,
  prepareFacetsStore
} from './utils';

describe('testing EditableNumberRangeFilterEntity', () => {
  it('allows selecting a non selected filter when its min value is not null', () => {
    const store = prepareFacetsStore();
    const range: RangeValue = { min: 3, max: null };
    const filter = createEditableNumberRangeFilter('price', range, false);
    const filterEntity = new EditableNumberRangeFilterEntity(store);

    expect(filter.selected).toBe(false);
    filterEntity.select(filter);
    expect(isEditableNumberRangeFilterSelected(store, filter.facetId)).toBe(true);
    expect(getStoreEditableNumberRangeFilter(store, filter.facetId).range).toEqual(range);
  });

  it('allows selecting a non selected filter when its max value is not null', () => {
    const store = prepareFacetsStore();
    const range = { min: null, max: 5 };
    const filter = createEditableNumberRangeFilter('age', range, false);
    const filterEntity = new EditableNumberRangeFilterEntity(store);

    expect(filter.selected).toBe(false);
    filterEntity.select(filter);
    expect(isEditableNumberRangeFilterSelected(store, filter.facetId)).toBe(true);
    expect(getStoreEditableNumberRangeFilter(store, filter.facetId).range).toEqual(range);
  });

  it('allows deselecting a selected filter and set its range values to null', () => {
    const store = prepareFacetsStore();
    const filter = createEditableNumberRangeFilter('price', { min: 2, max: 10 }, true);
    const filterEntity = new EditableNumberRangeFilterEntity(store);

    expect(filter.selected).toBe(true);
    filterEntity.deselect(filter);
    expect(isEditableNumberRangeFilterSelected(store, filter.facetId)).toBe(false);
    expect(getStoreEditableNumberRangeFilter(store, filter.facetId).range).toEqual({
      min: null,
      max: null
    });
  });

  it('deselects a selected filter when filter range values are null', () => {
    const store = prepareFacetsStore();
    const filter = createEditableNumberRangeFilter('price', { min: null, max: null }, true);
    const filterEntity = new EditableNumberRangeFilterEntity(store);

    expect(filter.selected).toBe(true);
    filterEntity.select(filter);
    expect(isEditableNumberRangeFilterSelected(store, filter.facetId)).toBe(false);
  });
});
