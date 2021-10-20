import { createSimpleFilter } from '../../../../__stubs__/filters-stubs.factory';
import { SimpleFilterEntity } from '../simple-filter.entity';
import { isFilterSelected, prepareFacetsStore } from './utils';

describe('testing SimpleFilterEntity', () => {
  it('allows selecting and deselecting a filter', () => {
    const store = prepareFacetsStore();
    const filter = createSimpleFilter('size', 'xxs');
    const filterEntity = new SimpleFilterEntity(store);

    // Select a filter that is NOT in the store
    filterEntity.select(filter);
    expect(isFilterSelected(store, filter.id)).toBe(true);

    // Deselect a filter that is in in the store
    filterEntity.deselect(filter);
    expect(isFilterSelected(store, filter.id)).toBe(false);

    // Select a filter that is in the store
    filterEntity.select(filter);
    expect(isFilterSelected(store, filter.id)).toBe(true);
  });

  it('allows deselecting a filter that is NOT in the store', () => {
    const store = prepareFacetsStore();
    const filter = createSimpleFilter('size', 'xxs', 10, true);
    const filterEntity = new SimpleFilterEntity(store);

    // Deselect a filter that is NOT in the store
    filterEntity.deselect(filter);
    expect(isFilterSelected(store, filter.id)).toBe(false);
  });

  it('selects multiple filters at the same time', () => {
    const store = prepareFacetsStore();
    const sizeSmallFilter = createSimpleFilter('size', 's', 10, true);
    const sizeMediumFilter = createSimpleFilter('size', 'm', 10, true);
    const filterEntity = new SimpleFilterEntity(store);

    // Deselect a filter that is NOT in the store
    filterEntity.select(sizeSmallFilter);
    expect(isFilterSelected(store, sizeSmallFilter.id)).toBe(true);

    filterEntity.select(sizeMediumFilter);
    expect(isFilterSelected(store, sizeSmallFilter.id)).toBe(true);
    expect(isFilterSelected(store, sizeMediumFilter.id)).toBe(true);
  });
});
