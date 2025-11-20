import type { Facet, Filter } from '@empathyco/x-types'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type { FacetsActions, FacetsGetters, FacetsMutations, FacetsState } from '../types'
import { Store } from 'vuex'
import {
  createEditableNumberRangeFacetStub,
  createHierarchicalFacetStub,
  createNumberRangeFacetStub,
  createSimpleFacetStub,
} from '../../../../__stubs__/facets-stubs.factory'
import {
  createEditableNumberRangeFilter,
  createHierarchicalFilter,
  createNumberRangeFilter,
  createRawFilter,
  createSimpleFilter,
  getHierarchicalFilterStub,
} from '../../../../__stubs__/filters-stubs.factory'
import { arrayToObject } from '../../../../utils/array'
import { UNKNOWN_FACET_KEY } from '../constants'
import { facetsXStoreModule } from '../module'
import { resetFacetsStateWith } from './utils'

describe('testing facets module getters', () => {
  const store: SafeStore<FacetsState, FacetsGetters, FacetsMutations, FacetsActions> = new Store(
    facetsXStoreModule as any,
  )

  beforeEach(() => {
    resetFacetsStateWith(store)
  })

  function createFacetsStore(
    filters: Filter[],
    facets: Omit<Facet, 'filters'>[] = [],
    stickyFilters: Filter[] = [],
  ): SafeStore<FacetsState, FacetsGetters, FacetsMutations, FacetsActions> {
    const store = new Store<FacetsState>(facetsXStoreModule as any)
    resetFacetsStateWith(store, {
      filters: arrayToObject(filters, 'id'),
      facets: arrayToObject(facets, 'id'),
      stickyFilters: arrayToObject(stickyFilters, 'id'),
    })
    return store
  }

  describe('selected filters getter', () => {
    it('returns an empty array if there are no filters', () => {
      const store = createFacetsStore([])

      expect(store.getters.selectedFilters).toEqual([])
    })

    it('returns an array containing the selected filters', () => {
      const store = createFacetsStore([
        createSimpleFilter('color', 'Red', false),
        createSimpleFilter('color', 'Blue', true),
        createHierarchicalFilter('category', 'Summer', false),
        createHierarchicalFilter('category', 'Shorts', true),
        createNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNumberRangeFilter('price', { min: 25, max: 50 }, true),
        createEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createEditableNumberRangeFilter('size', { min: null, max: null }),
        createRawFilter('size:xl'),
      ])

      expect(store.getters.selectedFilters).toHaveLength(5)
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([
          store.state.filters['color:Blue'],
          store.state.filters['category:Shorts'],
          store.state.filters['price:25-50'],
          store.state.filters['age:*-5'],
          store.state.filters['size:xl'],
        ]),
      )
    })

    it('returns selected simple filters', () => {
      const store = createFacetsStore([
        createSimpleFilter('color', 'Red', false),
        createSimpleFilter('color', 'Blue', true),
      ])

      expect(store.getters.selectedFilters).toHaveLength(1)
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([store.state.filters['color:Blue']]),
      )
    })

    it('returns selected hierarchical filters', () => {
      const store = createFacetsStore([
        createHierarchicalFilter('category', 'Summer', false),
        createHierarchicalFilter('category', 'Shorts', true),
      ])

      expect(store.getters.selectedFilters).toHaveLength(1)
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([store.state.filters['category:Shorts']]),
      )
    })

    it('returns selected number range filters', () => {
      const store = createFacetsStore([
        createNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNumberRangeFilter('price', { min: 25, max: 50 }, true),
      ])

      expect(store.getters.selectedFilters).toHaveLength(1)
      expect.arrayContaining([store.state.filters['price:25-50']])
    })

    it('returns selected editable number range filters', () => {
      const store = createFacetsStore([
        createEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createEditableNumberRangeFilter('size', { min: null, max: null }),
      ])

      expect(store.getters.selectedFilters).toHaveLength(1)
      expect(store.getters.selectedFilters).toEqual(
        expect.arrayContaining([store.state.filters['age:*-5']]),
      )
    })

    it('returns raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')])

      expect(store.getters.selectedFilters).toEqual([store.state.filters['size:xl']])
    })

    it('returns the sticky filters', () => {
      const store = createFacetsStore(
        [createSimpleFilter('color', 'Red', false), createSimpleFilter('color', 'Blue', true)],
        [],
        [createSimpleFilter('color', 'Blue', true)],
      )
      expect(store.getters.selectedFilters).toEqual([store.state.filters['color:Blue']])
      resetFacetsStateWith(store, {
        filters: {},
        facets: {},
        stickyFilters: arrayToObject([createSimpleFilter('color', 'Blue', true)], 'id'),
      })
      expect(store.getters.selectedFilters).toEqual([store.state.stickyFilters['color:Blue']])
    })
  })

  describe('selected filters for request getter', () => {
    it('returns an empty array if there are no filters', () => {
      const store = createFacetsStore([])

      expect(store.getters.selectedFiltersForRequest).toEqual([])
    })

    it('returns an array containing the selected filters', () => {
      const store = createFacetsStore([
        createSimpleFilter('color', 'Red', false),
        createSimpleFilter('color', 'Blue', true),
        createHierarchicalFilter('category', 'Summer', false),
        createHierarchicalFilter('category', 'Shorts', true),
        createNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNumberRangeFilter('price', { min: 25, max: 50 }, true),
        createEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createEditableNumberRangeFilter('size', { min: null, max: null }),
        createRawFilter('size:xl'),
      ])

      expect(store.getters.selectedFiltersForRequest).toHaveLength(5)
      expect(store.getters.selectedFiltersForRequest).toEqual(
        expect.arrayContaining([
          store.state.filters['color:Blue'],
          store.state.filters['category:Shorts'],
          store.state.filters['price:25-50'],
          store.state.filters['age:*-5'],
          store.state.filters['size:xl'],
        ]),
      )
    })

    it('returns selected simple filters', () => {
      const store = createFacetsStore([
        createSimpleFilter('color', 'Red', false),
        createSimpleFilter('color', 'Blue', true),
      ])

      expect(store.getters.selectedFiltersForRequest).toHaveLength(1)
      expect(store.getters.selectedFiltersForRequest).toEqual(
        expect.arrayContaining([store.state.filters['color:Blue']]),
      )
    })

    it('returns selected hierarchical filters', () => {
      const store = createFacetsStore([
        createHierarchicalFilter('category', 'Summer', false),
        createHierarchicalFilter('category', 'Shorts', true),
      ])

      expect(store.getters.selectedFiltersForRequest).toHaveLength(1)
      expect(store.getters.selectedFiltersForRequest).toEqual(
        expect.arrayContaining([store.state.filters['category:Shorts']]),
      )
    })

    it('returns selected number range filters', () => {
      const store = createFacetsStore([
        createNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNumberRangeFilter('price', { min: 25, max: 50 }, true),
      ])

      expect(store.getters.selectedFiltersForRequest).toHaveLength(1)
      expect.arrayContaining([store.state.filters['price:25-50']])
    })

    it('returns selected editable number range filters', () => {
      const store = createFacetsStore([
        createEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createEditableNumberRangeFilter('size', { min: null, max: null }),
      ])

      expect(store.getters.selectedFiltersForRequest).toHaveLength(1)
      expect(store.getters.selectedFiltersForRequest).toEqual(
        expect.arrayContaining([store.state.filters['age:*-5']]),
      )
    })

    it('returns raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')])

      expect(store.getters.selectedFiltersForRequest).toEqual([store.state.filters['size:xl']])
    })

    it("applying `leaves-only` strategy returns only filters that don't have children selected", () => {
      const parentFilter = createHierarchicalFilter('parent', 'parent', true)
      const childFilter = getHierarchicalFilterStub({
        id: 'child',
        label: 'child',
        parentId: parentFilter.id,
        selected: true,
      })
      parentFilter.children = [childFilter]
      const parentFilterWithoutChild = createHierarchicalFilter(
        'parentWithoutChildren',
        'parentWithoutChildren',
        true,
      )

      const store = createFacetsStore([parentFilter, childFilter, parentFilterWithoutChild], [])
      store.commit('setConfig', {
        filtersStrategyForRequest: 'leaves-only',
      })

      expect(store.getters.selectedFiltersForRequest).toEqual([
        childFilter,
        parentFilterWithoutChild,
      ])
    })
  })

  describe('selected filters by facet getter', () => {
    it('returns an empty object if there are no filters', () => {
      const store = createFacetsStore([])
      expect(store.getters.selectedFiltersByFacet).toEqual({})
    })

    it('returns an object containing all the selected filters indexed by its facet', () => {
      const store = createFacetsStore([
        createSimpleFilter('color', 'Red', false),
        createSimpleFilter('color', 'Blue', true),
        createHierarchicalFilter('category', 'Summer', false),
        createHierarchicalFilter('category', 'Shorts', true),
        createNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNumberRangeFilter('price', { min: 25, max: 50 }, true),
        createEditableNumberRangeFilter('age', { min: null, max: 5 }),
        createEditableNumberRangeFilter('size', { min: null, max: null }),
        // Raw filters don't belong to a facet, so they will be under UNKNOWN_FACET_KEY key
        createRawFilter('size:xl'),
      ])

      expect(store.getters.selectedFiltersByFacet).toEqual({
        color: [store.state.filters['color:Blue']],
        category: [store.state.filters['category:Shorts']],
        price: [store.state.filters['price:25-50']],
        age: [store.state.filters['age:*-5']],
        [UNKNOWN_FACET_KEY]: [store.state.filters['size:xl']],
      })
    })

    it('returns a record containing the simple filters indexed by its id', () => {
      const store = createFacetsStore([
        createSimpleFilter('color', 'Red', false),
        createSimpleFilter('color', 'Blue', true),
      ])

      expect(store.getters.selectedFiltersByFacet).toEqual({
        color: [store.state.filters['color:Blue']],
      })
    })

    it('returns a record containing the hierarchical filters indexed by its id', () => {
      const store = createFacetsStore([
        createHierarchicalFilter('category', 'Summer', false),
        createHierarchicalFilter('category', 'Shorts', true),
      ])

      expect(store.getters.selectedFiltersByFacet).toEqual({
        category: [store.state.filters['category:Shorts']],
      })
    })

    it('returns a record containing the number range filters indexed by its id', () => {
      const store = createFacetsStore([
        createNumberRangeFilter('price', { min: 0, max: 25 }, false),
        createNumberRangeFilter('price', { min: 25, max: 50 }, true),
      ])

      expect(store.getters.selectedFiltersByFacet).toEqual({
        price: [store.state.filters['price:25-50']],
      })
    })

    it('returns a record containing the editable number range filters indexed by its id', () => {
      const store = createFacetsStore([
        createEditableNumberRangeFilter('age', { min: null, max: 5 }),
      ])

      expect(store.getters.selectedFiltersByFacet).toEqual({
        age: [store.state.filters['age:*-5']],
      })
    })

    it('returns raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')])

      expect(store.getters.selectedFiltersByFacet).toEqual({
        [UNKNOWN_FACET_KEY]: [store.state.filters['size:xl']],
      })
    })
  })

  describe('facets getter', () => {
    it('returns an empty object if there are no facets', () => {
      const store = createFacetsStore([])
      expect(store.getters.facets).toEqual({})
    })

    it('returns an object containing all the facets with their filters', () => {
      const facets = [
        createSimpleFacetStub('color', createFilter => [
          createFilter('Red', false),
          createFilter('Blue', true),
        ]),
        createHierarchicalFacetStub('category', createFilter => [
          createFilter('Summer', false),
          createFilter('Shorts', true),
        ]),
        createNumberRangeFacetStub('price', createFilter => [
          createFilter({ min: 0, max: 25 }, true),
          createFilter({ min: 25, max: 50 }, true),
        ]),
        createEditableNumberRangeFacetStub('age', createFilter =>
          createFilter({ min: null, max: 5 }, true),
        ),
        createEditableNumberRangeFacetStub('size', createFilter =>
          createFilter({ min: null, max: null }, false),
        ),
      ]

      const store = createFacetsStore(
        facets.flatMap<Filter>(facet => facet.filters),
        facets.map(({ filters, ...restFacet }) => restFacet),
      )

      expect(store.getters.facets).toEqual(arrayToObject(facets, 'id'))
    })

    it('does not return raw filters', () => {
      const store = createFacetsStore([createRawFilter('size:xl')])

      expect(store.getters.facets).toEqual({})
    })
  })

  describe('request getter', () => {
    it('should return a request object if there is a query with module properties', () => {
      resetFacetsStateWith(store, {
        query: 'doraemon',
        origin: 'search_box:external',
        params: {
          instance: 'empathy',
          env: 'staging',
        },
      })

      expect(store.getters.request).toEqual({
        query: 'doraemon',
        origin: 'search_box:external',
        filters: {},
        extraParams: {
          instance: 'empathy',
          env: 'staging',
        },
      })
    })

    it('should return null when there is not query', () => {
      expect(store.getters.request).toBeNull()
    })
  })
})
