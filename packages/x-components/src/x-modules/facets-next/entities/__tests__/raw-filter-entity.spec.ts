import { Store } from 'vuex';
import { RawFilter } from '@empathyco/x-types-next';
import { createRawFilter } from '../../../../__stubs__/filters-stubs.factory';
import { RawFilterEntity } from '../raw-filter.entity';
import { RootXStoreState } from '../../../../store/store.types';
import { prepareFacetsStore } from './utils';

describe('testing RawFilterEntity', () => {
  let store: Store<RootXStoreState>, filter: RawFilter, filterEntity: RawFilterEntity;

  beforeEach(() => {
    store = prepareFacetsStore();
    filter = createRawFilter('rawFilter1');

    filterEntity = new RawFilterEntity(store, filter);
  });

  it('adds the filter to the store when selecting it', () => {
    expect(store.state.x.facetsNext.filters[filter.id]).toBeUndefined();

    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(true);
  });

  it('removes the filter from the store when deselecting it', () => {
    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id]).not.toBeUndefined();
    filterEntity.deselect();
    expect(store.state.x.facetsNext.filters[filter.id]).toBeUndefined();
  });

  it('is always selected regardless of being selected or deselected from the store', () => {
    expect(filter.selected).toBe(true);
    filterEntity.select();
    expect(filter.selected).toBe(true);
    filterEntity.deselect();
    expect(filter.selected).toBe(true);
  });
});
