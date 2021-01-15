import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { arrayToObject, deepFlat, map } from '../../../../utils';
import {
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

  describe(`${gettersKeys.flattenedFilters} getter`, () => {
    it('should be empty when there are no facets', () => {
      resetFacetsStateWith(store, {
        facets: {}
      });

      expect(store.getters.flattenedFilters).toEqual({});
    });

    it('should not be empty when there are facets', () => {
      const facetsStub = getFacetsStub();
      resetFacetsStateWith(store, {
        facets: arrayToObject(facetsStub, 'id')
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
        facets: arrayToObject(facetsStub, 'id')
      });

      expect(store.getters.flattenedFilters).toStrictEqual(filtersDictStub);
    });

    it('should be filters at the same depth level', () => {
      const facetsStub = getFacetsStub();
      resetFacetsStateWith(store, {
        facets: arrayToObject(facetsStub, 'id')
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
  });

  describe(`${gettersKeys.selectedFilters} getter`, () => {
    it('should be empty when no filters are selected', () => {
      const facetsStub = getFacetsStub();
      resetFacetsStateWith(store, {
        facets: arrayToObject(facetsStub, 'id')
      });

      expect(store.getters.selectedFilters).toHaveLength(0);
    });

    it('should be five the selectedFilters length after selecting five filters', () => {
      const facetsStub = getFacetsStub();
      const dictionaryFacetsStub = arrayToObject(facetsStub, 'label');

      dictionaryFacetsStub['hierarchical_category'].filters[0].selected = true;
      dictionaryFacetsStub['hierarchical_category'].filters[3].selected = true;
      dictionaryFacetsStub['brand_facet'].filters[0].selected = true;
      dictionaryFacetsStub['price_facet'].filters[0].selected = true;
      dictionaryFacetsStub['price_facet'].filters[1].selected = true;
      resetFacetsStateWith(store, {
        facets: dictionaryFacetsStub
      });

      expect(store.getters.selectedFilters).toHaveLength(5);
    });
  });

  describe(`${gettersKeys.selectedFiltersByFacet} getter`, () => {
    // eslint-disable-next-line max-len
    it('should group selected filters by its facet and facets without filters selected should be empty', () => {
      const facetsStub = getFacetsStub();
      const dictionaryFacetsStub = arrayToObject(facetsStub, 'label');

      dictionaryFacetsStub['hierarchical_category'].filters[0].selected = true;
      dictionaryFacetsStub['hierarchical_category'].filters[3].selected = true;
      dictionaryFacetsStub['price_facet'].filters[0].selected = true;
      resetFacetsStateWith(store, {
        facets: dictionaryFacetsStub
      });

      const expectedOutput: Record<string, number> = {
        hierarchical_category: 2,
        brand_facet: 0,
        price_facet: 1
      };

      Object.entries(expectedOutput).forEach(([key, value]) => {
        expect(store.getters.selectedFiltersByFacet[key]).toHaveLength(value);
      });
    });
  });
});
