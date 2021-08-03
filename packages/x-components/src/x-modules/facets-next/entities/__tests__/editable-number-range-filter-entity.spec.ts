import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { EditableNumberRangeFilter } from '@empathyco/x-types';
import { createNextEditableNumberRangeFilter } from '../../../../__stubs__/filters-stubs.factory';
import { RootXStoreState } from '../../../../store/store.types';
import { facetsNextXStoreModule } from '../../store/module';
import { EditableNumberRangeFilterEntity } from '../editable-number-range-filter.entity';

describe('testing EditableNumberRangeFilterEntity', () => {
  function prepareFacetsStore(): Store<RootXStoreState> {
    const vue = createLocalVue();
    vue.use(Vuex);
    return new Store({
      modules: {
        x: {
          modules: {
            facetsNext: { ...facetsNextXStoreModule, namespaced: true }
          },
          namespaced: true
        }
      }
    });
  }

  it('allows selecting a filter when filter min is not null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: 3, max: null });
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(true);
  });

  it('allows selecting a filter when filter max is not null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: null, max: 5 });
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(true);
  });

  it('allows deselecting a filter and set its range values to null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: 2, max: 10 });
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(true);

    filterEntity.deselect();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(false);
    expect(
      (store.state.x.facetsNext.filters[filter.id] as unknown as EditableNumberRangeFilter).range
        .min
    ).toBeNull();
    expect(
      (store.state.x.facetsNext.filters[filter.id] as unknown as EditableNumberRangeFilter).range
        .max
    ).toBeNull();
  });

  it('deselects the filter when filter range values are null', () => {
    const store = prepareFacetsStore();
    const filter = createNextEditableNumberRangeFilter('price', { min: null, max: null });
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

    filterEntity.select();
    expect(store.state.x.facetsNext.filters[filter.id].selected).toBe(false);
  });
});
