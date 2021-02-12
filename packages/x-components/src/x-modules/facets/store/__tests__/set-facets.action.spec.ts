import { Facet, Filter } from '@empathy/search-types';
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

async function dispatchSetFacets({
  oldFacets,
  newFacets,
  ignoreNewFiltersSelected
}: DispatchSetFacetsOptions): Promise<DispatchSetFacetsAPI> {
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  if (oldFacets) {
    const initialFacets: ExtractPayload<FacetsMutations['setFacets']> = arrayToObject(
      oldFacets,
      'id'
    );
    store.commit(mutationKeys.setFacets, initialFacets);
  }

  if (ignoreNewFiltersSelected !== undefined) {
    store.commit(mutationKeys.setIgnoreNewFiltersSelected, ignoreNewFiltersSelected);
  }

  await store.dispatch(actionsKeys.setFacets, newFacets);

  return {
    getStoredFacets() {
      return store.state.facets;
    },
    getFiltersSelectedValue() {
      const filters: Record<Filter['id'], Filter> = store.getters[gettersKeys.flattenedFilters];
      return map(filters, (_, filter) => filter.selected);
    }
  };
}

describe(`${actionsKeys.setFacets} action`, () => {
  it('should store the provided facets list in the state as a dictionary', async () => {
    const facets = getFacetsStub();
    const { getStoredFacets } = await dispatchSetFacets({ newFacets: facets });
    expect(getStoredFacets()).toEqual(arrayToObject(facets, 'id'));
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

      const { getFiltersSelectedValue } = await dispatchSetFacets({
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

      const { getFiltersSelectedValue } = await dispatchSetFacets({
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

  describe('when config.ignoreNewFiltersSelected = false', () => {
    it('keeps the new simple facets filters selected property untouched', async () => {
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

      const { getFiltersSelectedValue } = await dispatchSetFacets({
        ignoreNewFiltersSelected: false,
        oldFacets: [currentCategoryFacet],
        newFacets: [newCategoryFacet]
      });

      expect(getFiltersSelectedValue()).toEqual({
        'category:men': false,
        'category:women': true,
        'category:kid': true
      });
    });

    it('keeps the new hierarchical facets filters selected property untouched', async () => {
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

      const { getFiltersSelectedValue } = await dispatchSetFacets({
        ignoreNewFiltersSelected: false,
        oldFacets: [currentCategoryFacet],
        newFacets: [newCategoryFacet]
      });

      expect(getFiltersSelectedValue()).toEqual({
        'category:men': false,
        'category:shirts': false,
        'category:striped': false,
        'category:women': true,
        'category:shoes': true,
        'category:sport': true,
        'category:kid': true
      });
    });
  });
});

/** API returned by the {@link dispatchSetFacets} helper. */
interface DispatchSetFacetsAPI {
  /** Returns a dictionary containing all the filters where the key is the filter id, and the value
   * is the selected property of that filter. */
  getFiltersSelectedValue: () => Record<Filter['id'], Filter['selected']>;
  /** Returns the facets contained in the state. */
  getStoredFacets: () => FacetsState['facets'];
}

/**
 * Options to call the {@link dispatchSetFacets} helper with.
 */
interface DispatchSetFacetsOptions {
  /** If provided, changes the {@link FacetsConfig.ignoreNewFiltersSelected} value. */
  ignoreNewFiltersSelected?: boolean;
  /** If provided, it saves this facets to the state before dispatching
   * {@link FacetsActions.setFacets}. */
  oldFacets?: Facet[];
  /** Facets to use as payload for the {@link FacetsActions.setFacets} action. */
  newFacets: Facet[];
}
