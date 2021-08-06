import { Store } from 'vuex';
import { RawFilter } from '@empathyco/x-types-next';
import { createRawFilter } from '../../../../__stubs__/filters-stubs.factory';
import { RawFilterEntity } from '../raw-filter.entity';
import { RootXStoreState } from '../../../../store/store.types';
import { getStoreFilter, isFilterSelected, prepareFacetsStore } from './utils';

describe('testing RawFilterEntity', () => {
  let store: Store<RootXStoreState>, filter: RawFilter, filterEntity: RawFilterEntity;

  beforeEach(() => {
    store = prepareFacetsStore();
    filter = createRawFilter('rawFilter1');

    filterEntity = new RawFilterEntity(store);
  });

  it('adds the filter to the store when selecting it', () => {
    expect(getStoreFilter(store, filter.id)).toBeUndefined();

    filterEntity.select(filter);
    expect(isFilterSelected(store, filter.id)).toBe(true);
  });

  it('removes the filter from the store when deselecting it', () => {
    filterEntity.select(filter);
    expect(isFilterSelected(store, filter.id)).not.toBeUndefined();
    filterEntity.deselect(filter);
    expect(getStoreFilter(store, filter.id)).toBeUndefined();
  });

  it('is always selected regardless of being selected or deselected from the store', () => {
    expect(filter.selected).toBe(true);
    filterEntity.select(filter);
    expect(filter.selected).toBe(true);
    filterEntity.deselect(filter);
    expect(filter.selected).toBe(true);
  });
});
