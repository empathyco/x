import { BooleanFilter, Facet, Filter } from '@empathyco/x-types-old';
import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { arrayToObject } from '../../../../utils/array';
import { map } from '../../../../utils/object';
import { createSimpleFacetStub, getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsMutations, FacetsState } from '../types';
import { ExtractPayload } from '../../../../store/store.types';

Vue.use(Vuex);
const actionsKeys = map(facetsXStoreModule.actions, action => action);
const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
const mutationKeys = map(facetsXStoreModule.mutations, mutation => mutation);

async function dispatchSetFrontendFacets({
  oldFacets,
  newFacets
}: DispatchSetFrontendFacetsOptions): Promise<DispatchSetFrontendFacetsAPI> {
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  if (oldFacets) {
    const initialFacets: ExtractPayload<FacetsMutations['setFrontendFacets']> = arrayToObject(
      oldFacets,
      'id'
    );
    store.commit(mutationKeys.setFrontendFacets, initialFacets);
  }

  await store.dispatch(actionsKeys.setFrontendFacets, newFacets);

  return {
    getStoredFrontendFacets() {
      return store.state.frontendFacets;
    },
    getFiltersSelectedValue() {
      const filters: Record<Filter['id'], BooleanFilter> =
        store.getters[gettersKeys.flattenedFilters];
      return map(filters, (_, filter) => filter.selected);
    }
  };
}

describe(`${actionsKeys.setFrontendFacets} action`, () => {
  it('stores the provided facets list in the state as a dictionary', async () => {
    const newFacets = getFacetsStub();
    const { getStoredFrontendFacets } = await dispatchSetFrontendFacets({ newFacets });
    expect(getStoredFrontendFacets()).toEqual(arrayToObject(newFacets, 'id'));
  });

  it('overrides the stored frontendFacets with the new ones', async () => {
    const oldFacets = [
      createSimpleFacetStub('Category', createCategorySimpleFilter => [
        createCategorySimpleFilter('men', true),
        createCategorySimpleFilter('women', false),
        createCategorySimpleFilter('home', false)
      ])
    ];

    const newFacets = [
      createSimpleFacetStub('Category', createCategorySimpleFilter => [
        createCategorySimpleFilter('men', false),
        createCategorySimpleFilter('women', true),
        createCategorySimpleFilter('kid', true)
      ])
    ];
    const { getFiltersSelectedValue, getStoredFrontendFacets } = await dispatchSetFrontendFacets({
      oldFacets,
      newFacets
    });

    expect(getFiltersSelectedValue()).toEqual({
      'category:men': false,
      'category:women': true,
      'category:kid': true
    });
    expect(getStoredFrontendFacets()).toEqual(arrayToObject(newFacets, 'id'));
  });
});

/** API returned by the {@link dispatchSetFrontendFacets} helper. */
interface DispatchSetFrontendFacetsAPI {
  /** Returns a dictionary containing all the filters where the key is the filter id, and the value
   * is the selected property of that filter. */
  getFiltersSelectedValue: () => Record<Filter['id'], BooleanFilter['selected']>;
  /** Returns the frontend facets contained in the state. */
  getStoredFrontendFacets: () => FacetsState['frontendFacets'];
}

/**
 * Options to call the {@link dispatchSetFrontendFacets} helper with.
 */
interface DispatchSetFrontendFacetsOptions {
  /** If provided, it saves this facets to the state before dispatching
   * {@link FacetsActions.setFrontendFacets}. */
  oldFacets?: Facet[];
  /** Facets to use as payload for the {@link FacetsActions.setFrontendFacets} action. */
  newFacets: Facet[];
}
