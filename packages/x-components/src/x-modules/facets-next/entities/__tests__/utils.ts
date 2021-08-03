import { Filter } from '@empathyco/x-types-next';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { facetsNextXStoreModule } from '../../store/module';

/**
 * Creates an empty store with the {@link facetsNextXStoreModule} registered.
 *
 * @returns A store with the {@link facetsNextXStoreModule} registered.
 */
export function prepareFacetsStore(): Store<RootXStoreState> {
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

/**
 * Creates a store with the {@link facetsNextXStoreModule} registered, and initialises its
 * state with the provided filters.
 *
 * @param filters - The filters to set to the {@link facetsNextXStoreModule} module state.
 * @returns A store with the {@link facetsNextXStoreModule} registered, and the provided facets.
 */
export function prepareFacetsStoreWithFilters(filters: Filter[]): Store<RootXStoreState> {
  const store = prepareFacetsStore();
  resetStoreXModuleState(store, 'facetsNext', facetsNextXStoreModule.state(), {
    filters: arrayToObject(filters, 'id')
  });
  return store;
}
