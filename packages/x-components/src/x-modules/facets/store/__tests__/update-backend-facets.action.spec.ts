import { BooleanFilter, Facet, Filter } from '@empathy/search-types';
import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { arrayToObject } from '../../../../utils/array';
import { map } from '../../../../utils/object';
import {
  createHierarchicalFacetStub,
  createSimpleFacetStub,
  getFacetsStub
} from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsMutations, FacetsState } from '../types';
import { ExtractPayload } from '../../../../store/store.types';

Vue.use(Vuex);
const actionsKeys = map(facetsXStoreModule.actions, action => action);
const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
const mutationKeys = map(facetsXStoreModule.mutations, mutation => mutation);

async function dispatchUpdateBackendFacets({
  oldFacets,
  newFacets
}: DispatchUpdateBackendFacetsOptions): Promise<DispatchUpdateBackendFacetsAPI> {
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  if (oldFacets) {
    const initialFacets: ExtractPayload<FacetsMutations['setBackendFacets']> = arrayToObject(
      oldFacets,
      'id'
    );
    store.commit(mutationKeys.setBackendFacets, initialFacets);
  }

  await store.dispatch(actionsKeys.updateBackendFacets, newFacets);

  return {
    getStoredBackendFacets() {
      return store.state.backendFacets;
    },
    getFiltersSelectedValue() {
      const filters: Record<Filter['id'], BooleanFilter> =
        store.getters[gettersKeys.flattenedFilters];
      return map(filters, (_, filter) => filter.selected);
    }
  };
}

describe(`${actionsKeys.updateBackendFacets} action`, () => {
  it('should store the provided facets list in the state as a dictionary', async () => {
    const facets = getFacetsStub();
    const { getStoredBackendFacets } = await dispatchUpdateBackendFacets({ newFacets: facets });
    expect(getStoredBackendFacets()).toEqual(arrayToObject(facets, 'id'));
  });

  describe('when config.ignoreNewFiltersSelected = true', () => {
    it('should overwrite new default filters selected values with state values', async () => {
      const currentCategoryFacet = createSimpleFacetStub('Category', createCategorySimpleFilter => [
        createCategorySimpleFilter('men', true),
        createCategorySimpleFilter('women', false),
        createCategorySimpleFilter('home', false)
      ]);

      const newCategoryFacet = createSimpleFacetStub('Category', createCategorySimpleFilter => [
        createCategorySimpleFilter('men', false),
        createCategorySimpleFilter('women', true),
        createCategorySimpleFilter('kid', true)
      ]);

      const { getFiltersSelectedValue } = await dispatchUpdateBackendFacets({
        oldFacets: [currentCategoryFacet],
        newFacets: [newCategoryFacet]
      });

      expect(getFiltersSelectedValue()).toEqual({
        'category:men': true,
        'category:women': false,
        'category:kid': false
      });
    });

    // eslint-disable-next-line max-len
    it('should overwrite new hierarchical filters selected values with state values', async () => {
      const currentCategoryFacet = createHierarchicalFacetStub(
        'Category',
        createHierarchicalFilter => [
          createHierarchicalFilter('men', true, createHierarchicalFilter => [
            createHierarchicalFilter('shirts', true, createHierarchicalFilter => [
              createHierarchicalFilter('striped', true)
            ])
          ]),
          createHierarchicalFilter('women', false),
          createHierarchicalFilter('home', false)
        ]
      );

      const newCategoryFacet = createHierarchicalFacetStub('Category', createHierarchicalFilter => [
        createHierarchicalFilter('men', false, createHierarchicalFilter => [
          createHierarchicalFilter('shirts', false, createHierarchicalFilter => [
            createHierarchicalFilter('striped', false)
          ])
        ]),
        createHierarchicalFilter('women', true, createHierarchicalFilter => [
          createHierarchicalFilter('shoes', true, createHierarchicalFilter => [
            createHierarchicalFilter('sport', true)
          ])
        ]),
        createHierarchicalFilter('kid', true)
      ]);

      const { getFiltersSelectedValue } = await dispatchUpdateBackendFacets({
        oldFacets: [currentCategoryFacet],
        newFacets: [newCategoryFacet]
      });

      expect(getFiltersSelectedValue()).toEqual({
        'category:men': true,
        'category:shirts': true,
        'category:striped': true,
        'category:women': false,
        'category:shoes': false,
        'category:sport': false,
        'category:kid': false
      });
    });
  });
});

/** API returned by the {@link dispatchUpdateBackendFacets} helper. */
interface DispatchUpdateBackendFacetsAPI {
  /** Returns a dictionary containing all the filters where the key is the filter id, and the value
   * is the selected property of that filter. */
  getFiltersSelectedValue: () => Record<Filter['id'], BooleanFilter['selected']>;
  /** Returns the backend facets contained in the state. */
  getStoredBackendFacets: () => FacetsState['backendFacets'];
}

/**
 * Options to call the {@link dispatchUpdateBackendFacets} helper with.
 */
interface DispatchUpdateBackendFacetsOptions {
  /** If provided, it saves this facets to the state before dispatching
   * {@link FacetsActions.updateBackendFacets}. */
  oldFacets?: Facet[];
  /** Facets to use as payload for the {@link FacetsActions.updateBackendFacets} action. */
  newFacets: Facet[];
}
