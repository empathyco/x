import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { arrayToObject, map } from '../../../../utils';
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  beforeEach(() => {
    resetFacetsStateWith(store);
  });

  describe(`${gettersKeys.selectedFilters} getter`, () => {
    it('should be empty', () => {
      const facetsStub = getFacetsStub();
      resetFacetsStateWith(store, {
        facets: arrayToObject(facetsStub, 'id')
      });

      expect(store.getters.selectedFilters).toHaveLength(0);
    });

    it('should be 5 selected', () => {
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
});
