import { EditableNumberRangeFilter, Filter, Facet, isHierarchicalFilter } from '@empathyco/x-types';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { facetsXStoreModule } from '../../store/module';
import { flatHierarchicalFilters } from '../../utils';

/**
 * Creates an store with the {@link facetsXStoreModule} registered. It accepts an optional list
 * of filters to initialize the facets filters in the store.
 *
 * @param filters - An optional list of filters to initialise the store with.
 * @returns A store with the {@link facetsXStoreModule} registered.
 */
export function prepareFacetsStore(filters?: Filter[]): Store<RootXStoreState> {
  const vue = createLocalVue();
  vue.use(Vuex);
  const store = new Store({
    modules: {
      x: {
        modules: {
          facets: { ...facetsXStoreModule, namespaced: true }
        },
        namespaced: true
      }
    }
  });
  if (filters) {
    const hierarchicalFilters = filters.filter(isHierarchicalFilter);
    resetStoreXModuleState(store, 'facets', facetsXStoreModule.state(), {
      filters: arrayToObject([...filters, ...flatHierarchicalFilters(hierarchicalFilters)], 'id')
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
  return store.state.x.facets.filters[filterId].selected;
}

/**
 * Returns the stored filter with the given id.
 *
 * @param store - The store that contains the filter.
 * @param filterId - The id of the filter to retrieve.
 * @returns The filter if it exists in the store.
 */
export function getStoreFilter<SomeFilter extends Filter>(
  store: Store<RootXStoreState>,
  filterId: EditableNumberRangeFilter['id']
): SomeFilter {
  return store.state.x.facets.filters[filterId] as SomeFilter;
}

/**
 * Returns a {@link Filter} array with the filters with the `facetId`.
 *
 * @param store - The store that contains the filters.
 * @param facetId - The id of the facet to get its filters.
 * @returns The array of filters with the facetId.
 */
export function getStoreFiltersByFacetId<SomeFilter extends Filter = Filter>(
  store: Store<RootXStoreState>,
  facetId: Facet['id']
): SomeFilter[] {
  return store.getters['x/facets/facets'][facetId]?.filters ?? [];
}

/**
 * Retrieves the filter from the store and returns if it is selected and one range value is not
 * null.
 *
 * @param store - The store that contains the filter.
 * @param facetId - The id of the facet to check if it is selected.
 * @returns True if the filter is selected and one range value is not null, false otherwise.
 */
export function isEditableNumberRangeFilterSelected(
  store: Store<RootXStoreState>,
  facetId: Facet['id']
): boolean {
  const filter = getStoreEditableNumberRangeFilter(store, facetId);
  return filter.selected && (filter.range.min !== null || filter.range.max !== null);
}

/**
 * Retrieves an editable number range filter from the store using the facet id.
 *
 * @param store - The store that contains the filter.
 * @param facetId - The id of the facet to retrieve its editable filter.
 * @returns The editable number range filter from the provided facet id.
 */
export function getStoreEditableNumberRangeFilter(
  store: Store<RootXStoreState>,
  facetId: Facet['id']
): EditableNumberRangeFilter {
  return getStoreFiltersByFacetId<EditableNumberRangeFilter>(store, facetId)[0];
}
