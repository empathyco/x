import { Filter, EditableNumberRangeFilter } from '@empathyco/x-types-next';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { facetsNextXStoreModule } from '../../store/module';

/**
 * Creates an store with the {@link facetsNextXStoreModule} registered. It accepts an optional list
 * of filters to initialize the facets filters in the store.
 *
 * @param filters - An optional list of filters to initialise the store with.
 * @returns A store with the {@link facetsNextXStoreModule} registered.
 */
export function prepareFacetsStore(filters?: Filter[]): Store<RootXStoreState> {
  const vue = createLocalVue();
  vue.use(Vuex);
  const store = new Store({
    modules: {
      x: {
        modules: {
          facetsNext: { ...facetsNextXStoreModule, namespaced: true }
        },
        namespaced: true
      }
    }
  });
  if (filters) {
    resetStoreXModuleState(store, 'facetsNext', facetsNextXStoreModule.state(), {
      filters: arrayToObject(filters, 'id')
    });
  }
  return store;
}

/**
 * Retrieves the filter from the store and returns if it is selected.
 *
 * @param store - The store that contains the filter.
 * @param filterId - The id of the filter to check if it is selected.
 * @returns True if the filter is selected, false otherwise.
 */
export function isFilterSelected(store: Store<RootXStoreState>, filterId: Filter['id']): boolean {
  return store.state.x.facetsNext.filters[filterId].selected;
}
/**
 * Returns a {@link EditableNumberRangeFilter} filter from store found with the `filterId`.
 *
 * @param store - The store that contains the filter.
 * @param filterId - The id of the filter to check if it is selected.
 * @returns A {@link EditableNumberRangeFilter} if found.
 */
export function getStoreEditableNumberRangeFilter(
  store: Store<RootXStoreState>,
  filterId: EditableNumberRangeFilter['id']
): EditableNumberRangeFilter {
  return store.state.x.facetsNext.filters[filterId] as EditableNumberRangeFilter;
}

/**
 * Retrieves the filter from the store and returns if it is selected and one range value is not
 * null.
 *
 * @param store - The store that contains the filter.
 * @param filterId - The id of the filter to check if it is selected.
 * @returns True if the filter is selected and one range value is not null, false otherwise.
 */
export function isEditableNumberRangeFilterSelected(
  store: Store<RootXStoreState>,
  filterId: EditableNumberRangeFilter['id']
): boolean {
  const filter = getStoreEditableNumberRangeFilter(store, filterId);
  return filter.selected && (filter.range.min !== null || filter.range.max !== null);
}
