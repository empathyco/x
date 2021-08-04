import {
  Filter,
  EditableNumberRangeFilter as NextEditableNumberRangeFilter
} from '@empathyco/x-types-next';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
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
  filterId: NextEditableNumberRangeFilterNextEditableNumberRangeFilter['id']
): NextEditableNumberRangeFilterNextEditableNumberRangeFilter {
  return store.state.x.facetsNext.filters[
    filterId
  ] as NextEditableNumberRangeFilterNextEditableNumberRangeFilter;
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
  filterId: NextEditableNumberRangeFilter['id']
): boolean {
  const filter = getStoreEditableNumberRangeFilter(store, filterId);
  return filter.selected && (filter.range.min !== null || filter.range.max !== null);
}
