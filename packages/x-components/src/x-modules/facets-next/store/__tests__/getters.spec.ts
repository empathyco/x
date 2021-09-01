import { Facet, Filter } from '@empathyco/x-types-next';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import {
  createNextEditableNumberRangeFacetStub,
  createNextHierarchicalFacetStub,
  createNextNumberRangeFacetStub,
  createNextSimpleFacetStub
} from '../../../../__stubs__/facets-stubs.factory';
import {
  createNextEditableNumberRangeFilter,
  createNextHierarchicalFilter,
  createNextNumberRangeFilter,
  createNextSimpleFilter,
  createRawFilter
} from '../../../../__stubs__/filters-stubs.factory';
import { SafeStore } from '../../../../store/__tests__/utils';
import { arrayToObject } from '../../../../utils/array';
import { facetsNextXStoreModule } from '../module';
import {
  FacetsNextActions,
  FacetsNextGetters,
  FacetsNextMutations,
  FacetsNextState
} from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module getters', () => {
  function createFacetsStore(
    filters: Filter[],
    facets: Omit<Facet, 'filters'>[] = []
  ): SafeStore<FacetsNextState, FacetsNextGetters, FacetsNextMutations, FacetsNextActions> {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<FacetsNextState>(facetsNextXStoreModule as any);
    resetFacetsStateWith(store, {
      filters: arrayToObject(filters, 'id'),
      facets: arrayToObject(facets, 'id')
    });
    return store;
  }

  describe('selected filters getter', () => {
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
        createRawFilter('size:xl')
      ]);

      expect(store.getters.selectedFilters).toHaveLength(5);
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([
          store.state.filters['color:Blue'],
          store.state.filters['category:Shorts'],
          store.state.filters['price:25-50'],
          store.state.filters['age:*-5'],
          store.state.filters['size:xl']
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

    it('returns raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')]);

      expect(store.getters.selectedFilters).toEqual([store.state.filters['size:xl']]);
    });
  });

  describe('selected filters by facet getter', () => {
    it('returns an empty object if there are no filters', () => {
      const store = createFacetsStore([]);
      expect(store.getters.selectedFiltersByFacet).toEqual({});
    });

    it('returns an object containing all the selected filters indexed by its facet', () => {
      const store = createFacetsStore([
        createNextSimpleFilter('color', 'Red', false),
        createNextSimpleFilter('color', 'Blue', true),
        createNextHierarchicalFilter('category', 'Summer', false),
        createNextHierarchicalFilter('category', 'Shorts', true),
        createNextNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNextNumberRangeFilter('price', { min: 25, max: 50 }, true),
        createNextEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createNextEditableNumberRangeFilter('size', { min: null, max: null }),
        // Raw filters don't belong to a facet so they will be under `__unknown-facet__` key
        createRawFilter('size:xl')
      ]);

      expect(store.getters.selectedFiltersByFacet).toEqual({
        color: [store.state.filters['color:Blue']],
        category: [store.state.filters['category:Shorts']],
        price: [store.state.filters['price:25-50']],
        age: [store.state.filters['age:*-5']],
        ['__unknown-facet__']: [store.state.filters['size:xl']]
      });
    });

    it('returns a record containing the simple filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextSimpleFilter('color', 'Red', false),
        createNextSimpleFilter('color', 'Blue', true)
      ]);

      expect(store.getters.selectedFiltersByFacet).toEqual({
        color: [store.state.filters['color:Blue']]
      });
    });

    it('returns a record containing the hierarchical filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextHierarchicalFilter('category', 'Summer', false),
        createNextHierarchicalFilter('category', 'Shorts', true)
      ]);

      expect(store.getters.selectedFiltersByFacet).toEqual({
        category: [store.state.filters['category:Shorts']]
      });
    });

    it('returns a record containing the number range filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNextNumberRangeFilter('price', { min: 25, max: 50 }, true)
      ]);

      expect(store.getters.selectedFiltersByFacet).toEqual({
        price: [store.state.filters['price:25-50']]
      });
    });

    it('returns a record containing the editable number range filters indexed by its id', () => {
      const store = createFacetsStore([
        createNextEditableNumberRangeFilter('age', { min: null, max: 5 })
      ]);

      expect(store.getters.selectedFiltersByFacet).toEqual({
        age: [store.state.filters['age:*-5']]
      });
    });

    it('returns raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')]);

      expect(store.getters.selectedFiltersByFacet).toEqual({
        ['__unknown-facet__']: [store.state.filters['size:xl']]
      });
    });
  });

  describe('facets getter', () => {
    it('returns an empty object if there are no facets', () => {
      const store = createFacetsStore([]);
      expect(store.getters.facets).toEqual({});
    });

    it('returns an object containing all the facets with their filters', () => {
      const facets = [
        createNextSimpleFacetStub('color', createFilter => [
          createFilter('Red', false),
          createFilter('Blue', true)
        ]),
        createNextHierarchicalFacetStub('category', createFilter => [
          ...createFilter('Summer', false),
          ...createFilter('Shorts', true)
        ]),
        createNextNumberRangeFacetStub('price', createFilter => [
          createFilter({ min: 0, max: 25 }, true),
          createFilter({ min: 25, max: 50 }, true)
        ]),
        createNextEditableNumberRangeFacetStub('age', createFilter =>
          createFilter({ min: null, max: 5 }, true)
        ),
        createNextEditableNumberRangeFacetStub('size', createFilter =>
          createFilter({ min: null, max: null }, false)
        )
      ];

      const store = createFacetsStore(
        facets.map(facet => facet.filters).flat(),
        facets.map(({ filters, ...restFacet }) => restFacet)
      );

      expect(store.getters.facets).toEqual(arrayToObject(facets, 'id'));
    });

    it('does not return raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')]);

      expect(store.getters.facets).toEqual({});
    });
  });
});
