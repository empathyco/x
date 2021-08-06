import { createNextSimpleFilter } from '../../../../__stubs__/filters-stubs.factory';
import { SimpleFilterEntity } from '../simple-filter.entity';
import { prepareFacetsStore } from './utils';

describe('testing SimpleFilterEntity', () => {
  it('allows selecting and deselecting a filter', () => {
    const store = prepareFacetsStore();
    const filter = createNextSimpleFilter('size', 'xxs');
    const filterEntity = new SimpleFilterEntity(store, filter);

    // Select a filter that is NOT in the store
    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(true);

    // Deselect a filter that is in in the store
    filterEntity.deselect();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(false);

    // Select a filter that is in the store
    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(true);
  });

  it('allows deselecting a filter that is NOT in the store', () => {
    const store = prepareFacetsStore();
    const filter = createNextSimpleFilter('size', 'xxs', true);
    const filterEntity = new SimpleFilterEntity(store, filter);

    // Deselect a filter that is NOT in the store
    filterEntity.deselect();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(false);
  });
});
