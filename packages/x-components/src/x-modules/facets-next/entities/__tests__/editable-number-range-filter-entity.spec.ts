import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createNextSimpleFilter } from '../../../../__stubs__/filters-stubs.factory';
import { RootXStoreState } from '../../../../store/store.types';
import { facetsNextXStoreModule } from '../../store/module';
import { EditableNumberRangeFilterEntity } from '../simple-filter.entity';

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

  it('allows selecting and deselecting a filter', () => {
    const store = prepareFacetsStore();
    const filter = createNextSimpleFilter('size', 'xxs');
    const filterEntity = new EditableNumberRangeFilterEntity(store, filter);

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
