import { BooleanFilter, Facet, Filter } from '@empathyco/x-types-old';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createSimpleFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { ExtractPayload } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { map } from '../../../../utils/object';
import { facetsXStoreModule } from '../module';
import { FacetsMutations, FacetsState } from '../types';

Vue.use(Vuex);
const actionsKeys = map(facetsXStoreModule.actions, action => action);
const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
const mutationKeys = map(facetsXStoreModule.mutations, mutation => mutation);

async function dispatchSetBackendFacets({
  oldFacets,
  newFacets
}: DispatchSetBackendFacetsOptions): Promise<DispatchSetBackendFacetsAPI> {
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  if (oldFacets) {
    const initialFacets: ExtractPayload<FacetsMutations['setBackendFacets']> = arrayToObject(
      oldFacets,
      'id'
    );
    store.commit(mutationKeys.setBackendFacets, initialFacets);
  }

  await store.dispatch(actionsKeys.setBackendFacets, newFacets);

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

describe(`${actionsKeys.setBackendFacets} action`, () => {
  it('stores the provided facets keeping its filters selected state', async () => {
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
    const { getFiltersSelectedValue, getStoredBackendFacets } = await dispatchSetBackendFacets({
      oldFacets,
      newFacets
    });

    expect(getFiltersSelectedValue()).toEqual({
      'category:men': false,
      'category:women': true,
      'category:kid': true
    });
    expect(getStoredBackendFacets()).toEqual({
      [newFacets[0].id]: newFacets[0]
    });
  });
});

/** API returned by the {@link dispatchSetBackendFacets} helper. */
interface DispatchSetBackendFacetsAPI {
  /** Returns a dictionary containing all the filters where the key is the filter id, and the value
   * is the selected property of that filter. */
  getFiltersSelectedValue: () => Record<Filter['id'], BooleanFilter['selected']>;
  /** Returns the backend facets contained in the state. */
  getStoredBackendFacets: () => FacetsState['backendFacets'];
}

/**
 * Options to call the {@link dispatchSetBackendFacets} helper with.
 */
interface DispatchSetBackendFacetsOptions {
  /** Facets to use as payload for the {@link FacetsActions.setBackendFacets} action. */
  newFacets: Facet[];
  /** If provided, it saves this facets to the state before dispatching
   * {@link FacetsActions.setBackendFacets}. */
  oldFacets?: Facet[];
}
