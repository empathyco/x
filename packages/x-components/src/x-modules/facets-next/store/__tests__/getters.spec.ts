import { Filter } from '@empathyco/x-types-next';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import {
  createNextEditableNumberRangeFilter,
  createNextHierarchicalFilter,
  createNextNumberRangeFilter,
  createRawFilter,
  createNextSimpleFilter
} from '../../../../__stubs__/filters-stubs.factory';
import { ActionsDictionary, XActionContext } from '../../../../store/actions.types';
import { MutationsDictionary } from '../../../../store/mutations.types';
import { arrayToObject } from '../../../../utils/array';
import { Dictionary } from '../../../../utils/types';
import { facetsNextXStoreModule } from '../module';
import {
  FacetsNextActions,
  FacetsNextGetters,
  FacetsNextMutations,
  FacetsNextState
} from '../types';
import { resetFacetsStateWith } from './utils';

/** Type safe single module store. */
type SafeStore<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>
> = Omit<XActionContext<State, Getters, Mutations, Actions>, 'rootGetters' | 'rootState'>;

describe('testing facets module getters', () => {
  function createFacetsStore(
    filters: Filter[]
  ): SafeStore<FacetsNextState, FacetsNextGetters, FacetsNextMutations, FacetsNextActions> {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<FacetsNextState>(facetsNextXStoreModule as any);
    resetFacetsStateWith(store, { filters: arrayToObject(filters, 'id') });
    return store;
  }

  describe(`selected filters getter`, () => {
    it('returns an empty array if there are no filters', () => {
      const store = createFacetsStore([]);

      expect(store.getters.selectedFilters).toEqual([]);
    });

    it('returns an array containing the selected filters', () => {
      const store = createFacetsStore([
        createNextSimpleFilter('color', 'Red', false),
        createNextSimpleFilter('color', 'Blue', true),
        createNextHierarchicalFilter('category', 'Summer', false),
        createNextHierarchicalFilter('category', 'Shorts', true),
        createNextNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNextNumberRangeFilter('price', { min: 25, max: 50 }, true),
        createNextEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createNextEditableNumberRangeFilter('size', { min: null, max: null }),
        // Raw filters are always selected, but shouldn't be returned in this getter.
        createRawFilter('size:xl')
      ]);

      //expect(store.getters.selectedFilters).toHaveLength(4);
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([
          store.state.filters['color:Blue'],
          store.state.filters['category:Shorts'],
          store.state.filters['price:25-50'],
          store.state.filters['age:*-5']
        ])
      );
    });

    it('returns selected simple filters', () => {
      const store = createFacetsStore([
        createNextSimpleFilter('color', 'Red', false),
        createNextSimpleFilter('color', 'Blue', true)
      ]);

      expect(store.getters.selectedFilters).toHaveLength(1);
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([store.state.filters['color:Blue']])
      );
    });

    it('returns selected hierarchical filters', () => {
      const store = createFacetsStore([
        createNextHierarchicalFilter('category', 'Summer', false),
        createNextHierarchicalFilter('category', 'Shorts', true)
      ]);

      expect(store.getters.selectedFilters).toHaveLength(1);
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([store.state.filters['category:Shorts']])
      );
    });

    it('returns selected number range filters', () => {
      const store = createFacetsStore([
        createNextNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNextNumberRangeFilter('price', { min: 25, max: 50 }, true)
      ]);

      expect(store.getters.selectedFilters).toHaveLength(1);
      expect.arrayContaining([store.state.filters['price:25-50']]);
    });

    it('returns selected editable number range filters', () => {
      const store = createFacetsStore([
        createNextEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createNextEditableNumberRangeFilter('size', { min: null, max: null })
      ]);

      expect(store.getters.selectedFilters).toHaveLength(1);
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([store.state.filters['age:*-5']])
      );
    });
  });

  describe(`filters by facet getter`, () => {
    it('returns an empty object if there are no facets', () => {
      const store = createFacetsStore([]);
      expect(store.getters.filtersByFacet).toEqual({});
    });

    it('returns an object containing all the filters indexed by its facet', () => {
      const store = createFacetsStore([
        createNextSimpleFilter('color', 'Red', false),
        createNextSimpleFilter('color', 'Blue', true),
        createNextHierarchicalFilter('category', 'Summer', false),
        createNextHierarchicalFilter('category', 'Shorts', true),
        createNextNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNextNumberRangeFilter('price', { min: 25, max: 50 }, true),
        createNextEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createNextEditableNumberRangeFilter('size', { min: null, max: null }),
        // Raw filters are always selected, but shouldn't be returned in this getter.
        createRawFilter('size:xl')
      ]);

      expect(store.getters.filtersByFacet).toEqual({
        color: [store.state.filters['color:Red'], store.state.filters['color:Blue']],
        category: [store.state.filters['category:Summer'], store.state.filters['category:Shorts']],
        price: [store.state.filters['price:0-25'], store.state.filters['price:25-50']],
        age: [store.state.filters['age:*-5']],
        size: [store.state.filters['size:*-*']]
      });
    });

    it('returns a record containing the simple filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextSimpleFilter('color', 'Red', false),
        createNextSimpleFilter('color', 'Blue', true)
      ]);

      expect(store.getters.filtersByFacet).toEqual({
        color: [store.state.filters['color:Red'], store.state.filters['color:Blue']]
      });
    });

    it('returns a record containing the hierarchical filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextHierarchicalFilter('category', 'Summer', false),
        createNextHierarchicalFilter('category', 'Shorts', true)
      ]);

      expect(store.getters.filtersByFacet).toEqual({
        category: [store.state.filters['category:Summer'], store.state.filters['category:Shorts']]
      });
    });

    it('returns a record containing the number range filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNextNumberRangeFilter('price', { min: 25, max: 50 }, true)
      ]);

      expect(store.getters.filtersByFacet).toEqual({
        price: [store.state.filters['price:0-25'], store.state.filters['price:25-50']]
      });
    });

    it('returns a record containing the editable number range filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextEditableNumberRangeFilter('age', { min: null, max: 5 })
      ]);

      expect(store.getters.filtersByFacet).toEqual({
        age: [store.state.filters['age:*-5']]
      });
    });
  });
});
