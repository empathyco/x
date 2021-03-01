import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { arrayToObject, deepFlat, map } from '../../../../utils';
import {
  createSimpleFacetStub,
  createHierarchicalFacetStub,
  getFacetsStub,
  getHierarchicalFacetStub,
  getNumberRangeFacetStub,
  getSimpleFacetStub
} from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  const backendFacetsStub = [
    createHierarchicalFacetStub('hierarchical_category', createHierarchicalFilter => [
      createHierarchicalFilter('cars', true, createHierarchicalFilter => [
        createHierarchicalFilter('urban', true),
        createHierarchicalFilter('cross', false)
      ]),
      createHierarchicalFilter('bikes', false, createHierarchicalFilter => [
        createHierarchicalFilter('road', false),
        createHierarchicalFilter('track', false)
      ])
    ])
  ];

  const frontendFacetsStub = [
    createSimpleFacetStub('gender', createCategorySimpleFilter => [
      createCategorySimpleFilter('men', true),
      createCategorySimpleFilter('women', false),
      createCategorySimpleFilter('home', false)
    ]),
    createSimpleFacetStub('color', createCategorySimpleFilter => [
      createCategorySimpleFilter('red', true),
      createCategorySimpleFilter('blue', true)
    ])
  ];

  describe(`${gettersKeys.facets} getter`, () => {
    it('should be empty when there are no facets', () => {
      resetFacetsStateWith(store, {
        backendFacets: {},
        frontendFacets: {}
      });

      expect(store.getters.facets).toEqual({});
    });

    it('should group backend and frontend facets', () => {
      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(backendFacetsStub, 'id'),
        frontendFacets: arrayToObject(frontendFacetsStub, 'id')
      });

      expect(Object.keys(store.getters.facets)).toHaveLength(3);

      [...backendFacetsStub, ...frontendFacetsStub].forEach(facet => {
        expect(store.getters.facets[facet.id]).toEqual(facet);
      });
    });

    it('should override backend facets with frontend facets with the same id', () => {
      const frontendFacetsStub = [
        createSimpleFacetStub('bikes', createCategorySimpleFilter => [
          createCategorySimpleFilter('road', false),
          createCategorySimpleFilter('track', true)
        ])
      ];

      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(backendFacetsStub, 'id'),
        frontendFacets: arrayToObject(frontendFacetsStub, 'id')
      });

      expect(Object.keys(store.getters.facets)).toHaveLength(2);

      expect(store.getters.facets.bikes.filters[0].selected).toBe(false);
      expect(store.getters.facets.bikes.filters[0].id).toBe('bikes:road');
      expect(store.getters.facets.bikes.filters[1].selected).toBe(true);
      expect(store.getters.facets.bikes.filters[1].id).toBe('bikes:track');
    });
  });

  describe(`${gettersKeys.flattenedFilters} getter`, () => {
    it('should be empty when there are no facets', () => {
      resetFacetsStateWith(store, {
        backendFacets: {}
      });

      expect(store.getters.flattenedFilters).toEqual({});
    });

    it('should not be empty when there are facets', () => {
      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(backendFacetsStub, 'id'),
        frontendFacets: arrayToObject(frontendFacetsStub, 'id')
      });

      expect(Object.keys(store.getters.flattenedFilters).length).toBeGreaterThan(0);
    });

    it('should be the same dictionary when no hierarchical facets are included', () => {
      const facetsStub = [getSimpleFacetStub(), getNumberRangeFacetStub()];
      const filtersDictStub = arrayToObject(
        facetsStub.flatMap(facet => [...facet.filters]),
        'id'
      );

      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(facetsStub, 'id')
      });

      expect(store.getters.flattenedFilters).toStrictEqual(filtersDictStub);
    });

    it('should be filters at the same depth level', () => {
      const facetsStub = getFacetsStub();
      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(facetsStub, 'id')
      });

      expect(store.getters.flattenedFilters).toStrictEqual(
        arrayToObject(
          [
            ...getSimpleFacetStub().filters,
            ...deepFlat(getHierarchicalFacetStub().filters, 'children'),
            ...getNumberRangeFacetStub().filters
          ],
          'id'
        )
      );
    });

    it('should return backend and frontend filters at the same depth level', () => {
      const backendFacets = [getSimpleFacetStub()];
      const frontendFacets = [getNumberRangeFacetStub()];

      const filtersDictStub = arrayToObject(
        [...backendFacets, ...frontendFacets].flatMap(facet => [...facet.filters]),
        'id'
      );

      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(backendFacets, 'id'),
        frontendFacets: arrayToObject(frontendFacets, 'id')
      });

      expect(store.getters.flattenedFilters).toEqual(filtersDictStub);
    });
  });

  describe(`${gettersKeys.selectedFilters} getter`, () => {
    it('should be empty when no filters are selected', () => {
      const facetsStub = getFacetsStub();
      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(facetsStub, 'id')
      });

      expect(store.getters.selectedFilters).toHaveLength(0);
    });

    it('should be five the selectedFilters length after selecting five filters', () => {
      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(backendFacetsStub, 'id'),
        frontendFacets: arrayToObject(frontendFacetsStub, 'id')
      });

      expect(store.getters.selectedFilters).toHaveLength(5);
    });
  });

  describe(`${gettersKeys.selectedFiltersByFacet} getter`, () => {
    // eslint-disable-next-line max-len
    it('should group selected filters by its facet and facets without filters selected should be empty', () => {
      resetFacetsStateWith(store, {
        backendFacets: arrayToObject(backendFacetsStub, 'id'),
        frontendFacets: arrayToObject(frontendFacetsStub, 'id')
      });

      const expectedOutput: Record<string, number> = {
        hierarchical_category: 2,
        gender: 1,
        color: 2
      };

      Object.entries(expectedOutput).forEach(([key, value]) => {
        expect(store.getters.selectedFiltersByFacet[key]).toHaveLength(value);
      });
    });
  });
});
